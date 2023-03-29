<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { useSpaceStore } from '@/stores/space'

const spaceStore = useSpaceStore()
const { createNew, moveToRecycleBin } = spaceStore
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
</script>

<template>
  <div class="w-full h-full">
    <a-card class="w-full h-full">
      <div class="w-200px">
        <div v-if="loading">
          <a-skeleton active />
        </div>
        <div v-else>
          <div class="h-60px px-2 flex items-center justify-between">
            <div>{{ space?.name }}</div>
            <div class="i-ri-add-circle-line cursor-pointer" @click="createNew()" />
          </div>
          <a-tree
            v-model:expandedKeys="expandedKeys"
            :selected-keys="[currentId]"
            :tree-data="treeData"
          >
            <template #title="{ title, key }">
              <div class="group flex justify-between">
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
      </div>
    </a-card>
  </div>
</template>

<style lang="scss" scoped></style>
