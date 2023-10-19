<template>
  <div :class="$style.withoutStoreView">
    <div :class="$style.actions">
      <div :class="$style.column">
        <AppInput :modelValue="data.price" @update:modelValue="updatePrice" label="Price" />
        <div>{{ data.price }}</div>
      </div>

      <div :class="$style.column">
        <AppInput :modelValue="data.qty" @update:modelValue="updateQty" label="Qty" />
        <div>{{ data.qty }}</div>
      </div>
      <div :class="$style.column">
        <AppInput :modelValue="data.amount" @update:modelValue="updateAmount" label="Amount" />
        <div>{{ data.amount }}</div>
      </div>
      <div :class="$style.column">
        <button @click="send">Send</button>

        <div>{{ dataLocalStorage }}</div>
      </div>
    </div>

    <div :class="$style.body">
      <table :class="$style.table">
        <tr>
          <th :class="$style.cell">Event</th>
          <th :class="$style.cell">Field</th>
          <th :class="$style.cell">New value</th>
          <th :class="$style.cell">Old value</th>
        </tr>

        <tr v-for="item in events" :key="item.id">
          <td :class="$style.cell">{{ item.event }}</td>
          <td :class="$style.cell">{{ item.fields }}</td>
          <td :class="$style.cell">{{ item.newValue }}</td>
          <td :class="$style.cell">{{ item.oldValue }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { debounce } from '../utils';
import type { ChangedField, Data, EventItem } from '../types';
import AppInput from '../components/AppInput.vue';

const DATA_LOCAL_STORAGE_KEY = 'without-store-data';

const DEBOUNCE_WAIT = 300;
const SEND_WAIT = 1000;

const data = reactive<Data>({
  price: '',
  qty: '',
  amount: '',
  nonce: 0,
});

const firstChangedField = ref<ChangedField>();

const events = ref<EventItem[]>([]);

const dataLocalStorage = ref<string | null>(getDataLocalStorage());

function updatePrice(newValue: string): void {
  const oldValue = data.price;

  data.price = newValue;

  addEvent({
    event: 'updated by user',
    fields: 'price',
    newValue,
    oldValue,
  });

  onUpdatedField('price');
}

function updateQty(newValue: string): void {
  const oldValue = data.price;

  data.qty = newValue;

  addEvent({
    event: 'updated by user',
    fields: 'qty',
    newValue,
    oldValue,
  });

  onUpdatedField('qty');
}

function updateAmount(newValue: string): void {
  const oldValue = data.price;

  data.amount = newValue;

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
  const oldPrice = data.price;
  const oldQty = data.qty;
  const oldAmount = data.amount;

  switch (field) {
    case 'price':
      data.qty = '';
      data.amount = '';

      addEvent({
        event: 'cleared',
        fields: 'qty & amount',
        newValue: '',
        oldValue: `${oldQty} & ${oldAmount}`,
      });

      break;

    case 'qty':
      data.price = '';
      data.amount = '';

      addEvent({
        event: 'cleared',
        fields: 'price & amount',
        newValue: '',
        oldValue: `${oldPrice} & ${oldAmount}`,
      });

      break;

    case 'amount':
      data.price = '';
      data.qty = '';

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
  const oldPrice = data.price;
  const oldQty = data.qty;
  const oldAmount = data.amount;

  const newPrice = (Number(data.amount) / Number(data.qty)).toString();
  const newQty = (Number(data.amount) / Number(data.price)).toString();
  const newAmount = (Number(data.price) * Number(data.qty)).toString();

  if (data.price && data.qty && !data.amount && field !== 'amount') {
    data.amount = newAmount;

    addEvent({
      event: 'recalculated',
      fields: 'amount',
      newValue: newAmount,
      oldValue: oldAmount,
    });
  } else if (data.price && !data.qty && data.amount && field !== 'qty') {
    data.qty = newQty;

    addEvent({
      event: 'recalculated',
      fields: 'qty',
      newValue: newQty,
      oldValue: oldQty,
    });
  } else if (!data.price && data.qty && data.amount && field !== 'price') {
    data.price = newPrice;

    addEvent({
      event: 'recalculated',
      fields: 'price',
      newValue: newPrice,
      oldValue: oldPrice,
    });
  } else {
    const isAllFilled = !!data.price && !!data.qty && !!data.amount;

    if (!isAllFilled) {
      return;
    }

    switch (firstChangedField.value) {
      case 'price':
        data.price = newPrice;

        addEvent({
          event: 'recalculated',
          fields: 'price',
          newValue: newPrice,
          oldValue: oldPrice,
        });

        break;

      case 'qty':
        data.qty = newQty;

        addEvent({
          event: 'recalculated',
          fields: 'qty',
          newValue: newQty,
          oldValue: oldQty,
        });

        break;

      case 'amount':
        data.amount = newAmount;

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

async function send(): Promise<void> {
  const oldValue = getDataLocalStorage();
  const newValue = JSON.stringify(data);

  try {
    addEvent({
      event: 'try sending',
      fields: 'local storage',
      newValue,
      oldValue,
    });

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Number(data.amount) % 2 !== 0) {
          reject('error: the mounted is odd');
        } else {
          resolve(undefined);
        }
      }, SEND_WAIT);
    });

    setDataLocalStorage();

    addEvent({
      event: 'success sending',
      fields: 'local storage',
      newValue,
      oldValue,
    });
  } catch (error) {
    alert(error);

    addEvent({
      event: 'error sending',
      fields: 'local storage',
      newValue,
      oldValue,
    });
  }

  data.nonce++;
}

function setDataLocalStorage(): void {
  const dataJson = JSON.stringify(data);
  localStorage.setItem(DATA_LOCAL_STORAGE_KEY, dataJson);
  dataLocalStorage.value = dataJson;
}

function getDataLocalStorage(): string | null {
  return localStorage.getItem(DATA_LOCAL_STORAGE_KEY);
}

function addEvent(eventItem: Omit<EventItem, 'id'>): void {
  const id = events.value.length;

  events.value.unshift({
    id,
    ...eventItem,
  });
}
</script>

<style module>
.withoutStoreView {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions {
  display: flex;
  gap: 24px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.table {
  width: 100%;
}

.cell {
  border: 1px solid #dddddd;
}
</style>
