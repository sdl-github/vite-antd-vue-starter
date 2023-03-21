<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()
const menus = computed(() => userStore.menus)

const breadcrumbs = computed(() => {
  const path = route.path
  const menu = menus.value.find(menu => menu.path === path)
  return [menu?.title]
})
</script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      {{ breadcrumb }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
