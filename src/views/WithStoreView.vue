<template>
  <div :class="$style.withStoreView">
    <div :class="$style.actions">
      <div :class="$style.column">
        <AppInput :modelValue="data.price" @update:modelValue="appStore.updatePrice" label="Price" />
        <div>{{ data.price }}</div>
      </div>

      <div :class="$style.column">
        <AppInput :modelValue="data.qty" @update:modelValue="appStore.updateQty" label="Qty" />
        <div>{{ data.qty }}</div>
      </div>
      <div :class="$style.column">
        <AppInput :modelValue="data.amount" @update:modelValue="appStore.updateAmount" label="Amount" />
        <div>{{ data.amount }}</div>
      </div>
      <div :class="$style.column">
        <button @click="send">Send</button>

        <div>{{ appDataLocalStorage }}</div>
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
import { ref } from 'vue';
import AppInput from '../components/AppInput.vue';
import { useAppStore } from '../stores/useAppStore';
import { storeToRefs } from 'pinia';

const DATA_LOCAL_STORAGE_KEY = 'with-store-data';

const SEND_WAIT = 1000;

const appStore = useAppStore();

const { data, events } = storeToRefs(appStore);

const appDataLocalStorage = ref<string | null>(getDataLocalStorage());

async function send(): Promise<void> {
  const oldValue = getDataLocalStorage();
  const newValue = JSON.stringify(data.value);

  try {
    appStore.addEvent({
      event: 'try sending',
      fields: 'local storage',
      newValue,
      oldValue,
    });

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Number(data.value.amount) % 2 !== 0) {
          reject('error: the mounted is odd');
        } else {
          resolve(undefined);
        }
      }, SEND_WAIT);
    });

    setDataLocalStorage();

    appStore.addEvent({
      event: 'success sending',
      fields: 'local storage',
      newValue,
      oldValue,
    });
  } catch (error) {
    alert(error);

    appStore.addEvent({
      event: 'error sending',
      fields: 'local storage',
      newValue,
      oldValue,
    });
  }

  data.value.nonce++;
}

function setDataLocalStorage(): void {
  const appDataJson = JSON.stringify(data.value);
  localStorage.setItem(DATA_LOCAL_STORAGE_KEY, appDataJson);
  appDataLocalStorage.value = appDataJson;
}

function getDataLocalStorage(): string | null {
  return localStorage.getItem(DATA_LOCAL_STORAGE_KEY);
}
</script>

<style module>
.withStoreView {
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
