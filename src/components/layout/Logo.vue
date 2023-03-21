<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const collapsed = computed(() => appStore.collapsed)
const title = computed(() => appStore.title)
</script>

<template>
  <div class="flex items-center justify-center h-[50px]">
    <div class="text-[30px] i-twemoji-dragon" />
    <div v-show="!collapsed" class="text-white ml-2 font-bold text-sm">
      {{ title }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
