<template>
  <div class="flex items-center justify-center p-1 h-[50px]">
    <div class="i-logos-vue"></div>
    <h1 v-show="!collapsed" class="text-white mx-2 transition-all">{{ title }}</h1>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore()
const collapsed = computed(() => appStore.collapsed)
const title = computed(() => appStore.title)
 
</script>

<style lang="scss" scoped>
</style>
