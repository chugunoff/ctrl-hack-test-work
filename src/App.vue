<template>
  <div :class="$style.app">
    <div :class="$style.header">
      <RouterLink v-for="route in routes" :key="route.name" :to="{ name: route.name }" :activeClass="$style.active">
        {{ route.name }}
      </RouterLink>
    </div>

    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import { routes } from './routes';
</script>

<style module>
.app {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.active {
  background-color: #dddddd;
}
</style>
