import { defineStore } from 'pinia';
import { ref } from 'vue';
import { debounce } from '../utils';
import type { ChangedField, Data, EventItem } from '../types';

const DEBOUNCE_WAIT = 300;

export const useAppStore = defineStore('app', () => {
  const data = ref<Data>({
    price: '',
    qty: '',
    amount: '',
    nonce: 0,
  });

  const firstChangedField = ref<ChangedField>();

  const events = ref<EventItem[]>([]);

  function updatePrice(newValue: string): void {
    const oldValue = data.value.price;

    data.value.price = newValue;

    addEvent({
      event: 'updated by user',
      fields: 'price',
      newValue,
      oldValue,
    });

    onUpdatedField('price');
  }

  function updateQty(newValue: string): void {
    const oldValue = data.value.price;

    data.value.qty = newValue;

    addEvent({
      event: 'updated by user',
      fields: 'qty',
      newValue,
      oldValue,
    });

    onUpdatedField('qty');
  }

  function updateAmount(newValue: string): void {
    const oldValue = data.value.price;

    data.value.amount = newValue;

    addEvent({
      event: 'updated by user',
      fields: 'amount',
      newValue,
      oldValue,
    });

    onUpdatedField('amount');
  }

  function onUpdatedField(field: ChangedField): void {
    if (firstChangedField.value) {
      recalculateDebounce(field);
    } else {
      firstChangedField.value = field;
    }
  }

  const recalculateDebounce = debounce(recalculate, DEBOUNCE_WAIT);

  function recalculate(field: ChangedField): void {
    if (field === firstChangedField.value) {
      clear(field);
    } else {
      fill(field);
    }
  }

  function clear(field: ChangedField): void {
    const oldPrice = data.value.price;
    const oldQty = data.value.qty;
    const oldAmount = data.value.amount;

    switch (field) {
      case 'price':
        data.value.qty = '';
        data.value.amount = '';

        addEvent({
          event: 'cleared',
          fields: 'qty & amount',
          newValue: '',
          oldValue: `${oldQty} & ${oldAmount}`,
        });

        break;

      case 'qty':
        data.value.price = '';
        data.value.amount = '';

        addEvent({
          event: 'cleared',
          fields: 'price & amount',
          newValue: '',
          oldValue: `${oldPrice} & ${oldAmount}`,
        });

        break;

      case 'amount':
        data.value.price = '';
        data.value.qty = '';

        addEvent({
          event: 'cleared',
          fields: 'price & qty',
          newValue: '',
          oldValue: `${oldPrice} & ${oldQty}`,
        });

        break;
    }
  }

  function fill(field: ChangedField): void {
    const oldPrice = data.value.price;
    const oldQty = data.value.qty;
    const oldAmount = data.value.amount;

    const newPrice = (Number(data.value.amount) / Number(data.value.qty)).toString();
    const newQty = (Number(data.value.amount) / Number(data.value.price)).toString();
    const newAmount = (Number(data.value.price) * Number(data.value.qty)).toString();

    if (data.value.price && data.value.qty && !data.value.amount && field !== 'amount') {
      data.value.amount = newAmount;

      addEvent({
        event: 'recalculated',
        fields: 'amount',
        newValue: newAmount,
        oldValue: oldAmount,
      });
    } else if (data.value.price && !data.value.qty && data.value.amount && field !== 'qty') {
      data.value.qty = newQty;

      addEvent({
        event: 'recalculated',
        fields: 'qty',
        newValue: newQty,
        oldValue: oldQty,
      });
    } else if (!data.value.price && data.value.qty && data.value.amount && field !== 'price') {
      data.value.price = newPrice;

      addEvent({
        event: 'recalculated',
        fields: 'price',
        newValue: newPrice,
        oldValue: oldPrice,
      });
    } else {
      const isAllFilled = !!data.value.price && !!data.value.qty && !!data.value.amount;

      if (!isAllFilled) {
        return;
      }

      switch (firstChangedField.value) {
        case 'price':
          data.value.price = newPrice;

          addEvent({
            event: 'recalculated',
            fields: 'price',
            newValue: newPrice,
            oldValue: oldPrice,
          });

          break;

        case 'qty':
          data.value.qty = newQty;

          addEvent({
            event: 'recalculated',
            fields: 'qty',
            newValue: newQty,
            oldValue: oldQty,
          });

          break;

        case 'amount':
          data.value.amount = newAmount;

          addEvent({
            event: 'recalculated',
            fields: 'amount',
            newValue: newAmount,
            oldValue: oldAmount,
          });

          break;
      }
    }
  }

  function addEvent(eventItem: Omit<EventItem, 'id'>): void {
    const id = events.value.length;

    events.value.unshift({
      id,
      ...eventItem,
    });
  }

  return {
    data,
    firstChangedField,
    events,

    updatePrice,
    updateQty,
    updateAmount,

    addEvent,
  };
});
