<script setup lang="ts">
const spaceStore = useSpaceStore()
const breadcrumbs = computed(() => {
  return spaceStore.spaceLineMenus?.map(menu => menu.title)
})
</script>

<template>
  <div class="h-50px w-full bg-white flex items-center justify-between px-4">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
        {{ breadcrumb }}
      </a-breadcrumb-item>
    </a-breadcrumb>
      <a-button class="ml-4" type="primary">
          发布
      </a-button>
  </div>
</template>
