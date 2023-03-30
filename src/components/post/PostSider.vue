<script lang="ts" setup>
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
const treeData = computed(() => spaceStore.spaceMenus)
const spaceLineMenus = computed(() => spaceStore.spaceLineMenus)
const expandedKeys = ref<string[]>([])
watchOnce(spaceLineMenus, () => {
  console.log('// TODO expandedKeys has some bugs')
  expandedKeys.value = spaceStore.spaceLineMenus?.map(menu => menu.id) || []
})
onMounted(() => {
  spaceStore.querySpace()
})
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
      <a-tree v-model:expandedKeys="expandedKeys" block-node :selected-keys="[currentId as string]" :tree-data="treeData">
        <template #title="{ title, key }">
          <a-dropdown :trigger="['contextmenu', 'click']">
            <div class="group flex justify-between" @click.prevent="goPost(key)">
              <div class="">
                {{ title }}
              </div>
              <div class="display-none px-2 items-center group-hover:flex">
                <div class="i-ri-list-check ml-2">
                  打开
                </div>
                <div class="i-ri-add-fill ml-2" @click="createNew(key)" />
              </div>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a>
                    重命名
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="moveToRecycleBin(key)">
                    删除
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </div>
  </a-layout-sider>
</template>
