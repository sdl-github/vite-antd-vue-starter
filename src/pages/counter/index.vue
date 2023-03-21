<script setup lang="ts">
import { useStore } from '@/stores/counter'
const store = useStore()
console.log(store)
</script>

<template>
  <div>counter: {{ store.counter }}</div>
  <div>getters doubleCount: {{ store.doubleCount }}</div>
  <div>getters doublePlusOne: {{ store.doublePlusOne }}</div>

  <div>
    <a-button @click="store.reset">
      reset
    </a-button>
    <a-button @click="store.increment">
      increment
    </a-button>
    <a-button @click="store.randomizeCounter">
      randomizeCounter
    </a-button>
  </div>
</template>

<style>
</style>
