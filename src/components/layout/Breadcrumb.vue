<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const { menus } = useMenu()
const breadcrumbs = computed(() => {
  const path = route.path
  const paths = findTreePath(menus, 'path', path)
  return paths
})
</script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      {{ breadcrumb.element.title }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>
