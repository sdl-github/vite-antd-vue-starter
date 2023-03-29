<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { useSpaceStore } from '@/stores/space'
const router = useRouter()
const spaceStore = useSpaceStore()
const appStore = useAppStore()
const { createNew, moveToRecycleBin } = spaceStore
const collapsed = computed(() => appStore.collapsed)
const loading = computed(() => spaceStore.queryMenuLoading)
const space = computed(() => spaceStore.space)
const spaces = computed(() => spaceStore.spaces)
const currentId = computed(() => spaceStore.currentId)
const treeData = computed(() => {
  const list = spaceStore.spaceMenus?.map((menu) => {
    const { id: key } = menu
    return { ...menu, key }
  })
  return listToTree(cloneDeep(list), 'id', 'pId', null)
})
onMounted(() => {
  spaceStore.querySpace()
})
const expandedKeys = ref<string[]>([])

function goPost(id: string) {
  router.push({
    path: '/post/edit',
    query: { id },
  })
}
</script>

<template>
  <a-layout-sider v-model:collapsed="collapsed" class="h-100vh" :trigger="null" collapsible theme="light">
    <div v-if="loading">
      <a-skeleton active />
    </div>
    <div v-else>
      <div class="h-60px px-2 flex items-center justify-between">
        <div>{{ space?.name }}</div>
        <div class="i-ri-add-circle-line cursor-pointer" @click="createNew()" />
      </div>
      <a-tree v-model:expandedKeys="expandedKeys" :selected-keys="[currentId as string]" :tree-data="treeData">
        <template #title="{ title, key }">
          <div class="group flex justify-between" @click="goPost(key)">
            <div class="w-120px">
              {{ title }}
            </div>
            <div class="display-none px-2 items-center group-hover:flex">
              <div class="i-ri-delete-bin-line ml-2" @click="moveToRecycleBin(key)" />
              <div class="i-ri-add-fill ml-2" @click="createNew(key)" />
            </div>
          </div>
        </template>
      </a-tree>
    </div>
  </a-layout-sider>
</template>
