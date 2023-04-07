<script setup lang="ts">
const spaceStore = useSpaceStore()
const published = computed(() => spaceStore.post?.published)

const breadcrumbs = computed(() => {
  return spaceStore.spaceLineMenus?.map(menu => menu.title)
})
const open = ref(false)

function handleEdit() {

}
</script>

<template>
  <div class="h-50px w-full bg-white flex items-center justify-between px-4">
    <a-breadcrumb>
      <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
        {{ breadcrumb }}
      </a-breadcrumb-item>
    </a-breadcrumb>
    <a-button v-if="published" class="ml-4 flex items-center" type="primary" @click="handleEdit">
      <div class="i-ri-send-plane-fill" />
      <div class="ml-2">
        查看页面
      </div>
    </a-button>
    <a-button v-else class="ml-4" type="primary" @click="open = true">
      {{ published && '设置' || '发布' }}
    </a-button>
  </div>
  <PublishDrawer v-model:open="open" />
</template>
