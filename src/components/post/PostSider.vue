<script lang="tsx" setup>
import { useTippy } from 'vue-tippy'
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
const renameTitleRef = ref()
const currentMenuId = ref<string>('')
const isEditMenu = ref<boolean>(false)
onClickOutside(renameTitleRef, (event) => {
  isEditMenu.value = false
})
const menu = (
  <>
    <div class='w-200px c-black p-0.5 text-14px'>
      <div onClick={handleEditTitle} class='flex items-center px-2 my-1 rounded cursor-pointer h-2.25rem mx-0.375rem hover:bg-[#f5f5f5]'>
        <div class='i-ri-edit-box-line'></div>
        <span class='ml-2'>重命名</span>
      </div>
      <div onClick={handleMove} class='flex items-center px-2 my-1 rounded cursor-pointer h-2.25rem mx-0.375rem hover:bg-[#f5f5f5]'>
        <div class='i-ri-delete-bin-6-line'></div>
        <span class='ml-2'>删除</span>
      </div>
    </div>
  </>
)

const { show, hide, setProps } = useTippy(() => document.body, {
  content: menu,
  placement: 'right-start',
  trigger: 'manual',
  arrow: false,
  interactive: true,
  offset: [-10, 20],
})

async function handleMove() {
  await moveToRecycleBin(currentMenuId.value)
  hide()
}

function handleEditTitle(event: MouseEvent) {
  hide()
}

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

function contextmenu(event: MouseEvent, key: string) {
  event.preventDefault()
  currentMenuId.value = key
  setProps({
    getReferenceClientRect: () => ({
      width: 0,
      height: 0,
      top: event.clientY,
      bottom: event.clientY,
      left: event.clientX,
      right: event.clientX,
    }),
  })
  show()
}
function dblclick(key: string) {
  isEditMenu.value = true
  currentMenuId.value = key
}
</script>

<template>
  <a-layout-sider v-model:collapsed="collapsed" class="h-100vh" width="240" :trigger="null" collapsible theme="light">
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
        block-node
        :selected-keys="[currentId as string]"
        :tree-data="treeData"
      >
        <template #title="{ title, key }">
          <div
            class="group flex justify-between"
            @dblclick="dblclick(key)"
            @contextmenu="($event) => contextmenu($event, key)"
            @click.prevent="goPost(key)"
          >
            <div class="">
              <div v-if="isEditMenu && currentMenuId === key">
                <a-input ref="renameTitleRef" :value="title" />
              </div>
              <div v-else>
                {{ title }}
              </div>
            </div>
            <div v-if="!isEditMenu" class="display-none px-2 items-center group-hover:flex">
              <div class="i-ri-list-check ml-2" @click.stop="($event) => contextmenu($event, key)">
                打开
              </div>
              <div class="i-ri-add-fill ml-2" @click.stop="createNew(key)" />
            </div>
          </div>
        </template>
      </a-tree>
    </div>
  </a-layout-sider>
</template>

<style lang="scss" scoped>
$menu-height: 38px;
$menu-hover-color: #f5f5f5;
$menu-selected-color: rgba(0, 0, 0, .06);

:deep(.ant-tree-treenode) {
  transition: all 0.3s;
  border-radius: 5px;
  margin: 0 10px;
  padding: 0;
}

:deep(.ant-tree-treenode:hover) {
  background: $menu-hover-color;
}

:deep(.ant-tree-switcher) {
  line-height: $menu-height;
}

:deep(.ant-tree .ant-tree-node-content-wrapper) {
  min-height: $menu-height;
  line-height: $menu-height;
}

:deep(.ant-tree-treenode-selected) {
  background: $menu-selected-color;
}

:deep(.ant-tree-node-selected) {
  background-color: transparent !important;
}
</style>
