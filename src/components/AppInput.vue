<template>
  <div :class="$style.appInput">
    <label :for="id">{{ label }}</label>
    <input :id="id" :value="modelValue" type="number" @input="updateModelValue" />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: string;
  label: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void;
}>();

const id = crypto.getRandomValues(new Uint32Array(1))[0].toString();

function updateModelValue(event: Event): void {
  const target = event.target as HTMLInputElement;

  emit('update:modelValue', target.value);
}
</script>

<style module>
.appInput {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
