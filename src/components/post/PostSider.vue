<script lang="tsx" setup>
import { useTippy } from 'vue-tippy'
import data from '@emoji-mart/data'
import { Picker, init } from 'emoji-mart'
import { useSpaceStore } from '@/stores/space'

const router = useRouter()
const spaceStore = useSpaceStore()
const appStore = useAppStore()
const { createNew, moveToRecycleBin, updateSpaceMenuTitle, updateSpaceMenuIcon } = spaceStore
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

onMounted(() => {
  init({ data })
})

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
const emojiTippy = useTippy(() => document.body, {
  content: <div id="emoji-picker"></div>,
  trigger: 'manual',
  placement: 'auto-end',
  arrow: false,
  interactive: true,
  offset: [10, -10],
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
  nextTick(() => {
    renameTitleRef.value.focus()
  })
}

function handleInput(e: any) {
  const value = e.target.value
  updateSpaceMenuTitle(currentMenuId.value, value)
}

function handleKeyDown(e: any, key: string) {
  if (e.code === 'Escape' || e.code === 'Enter') {
    isEditMenu.value = false
  }
}

function onEmojiSelect(e: any) {
  updateSpaceMenuIcon(currentMenuId.value, e.shortcodes)
  emojiTippy.hide()
}

function handleOpenEmojiPicker(event: MouseEvent, item: any) {
  currentMenuId.value = item.id
  emojiTippy.setProps({
    getReferenceClientRect: () => ({
      width: 0,
      height: 0,
      top: event.clientY,
      bottom: event.clientY,
      left: event.clientX,
      right: event.clientX,
    }),
  })
  emojiTippy.show()
  nextTick(() => {
    const dom = document.querySelector('#emoji-picker')
    if (!dom?.hasChildNodes()) {
      const pickerOptions = { onEmojiSelect, data }
      dom?.appendChild(new Picker(pickerOptions) as unknown as Node)
    }
  })
}
</script>

<template>
  <a-layout-sider v-model:collapsed="collapsed" class="bg-[#fafafa]" width="260" :trigger="null" collapsible theme="light">
    <div v-if="loading">
      <a-skeleton active />
    </div>
    <div v-else class="px-2">
      <div class="h-60px flex items-center justify-between">
        <div>{{ space?.name }}</div>
        <div class="i-ri-add-circle-line cursor-pointer" @click="createNew()" />
      </div>
      <div class="">
        <a-tree
          v-model:expandedKeys="expandedKeys"
          block-node
          show-icon
          :selected-keys="[currentId as string]"
          :tree-data="treeData"
        >
          <template #icon="item">
            <MenuIcon :icon="item.menuIcon" :type="item.iconType" @click="handleOpenEmojiPicker($event, item)" />
          </template>
          <template #title="{ title, key }">
            <div
              class="group flex justify-between"
              @dblclick="dblclick(key)"
              @contextmenu="($event) => contextmenu($event, key)"
              @click.prevent="goPost(key)"
            >
              <template v-if="isEditMenu && currentMenuId === key">
                <a-input
                  ref="renameTitleRef"
                  :value="title"
                  @input="handleInput"
                  @keydown="handleKeyDown($event, key)"
                />
              </template>
              <template v-else>
                <div class="flex-1 line-clamp-1 ml-2">
                  {{ title }}
                </div>
                <div v-if="!isEditMenu" class="hidden px-2 items-center group-hover:flex">
                  <div class="i-ri-list-check ml-2" @click.stop="($event) => contextmenu($event, key)">
                    打开
                  </div>
                  <div class="i-ri-add-fill ml-2" @click.stop="createNew(key)" />
                </div>
              </template>
            </div>
          </template>
        </a-tree>
      </div>
    </div>
  </a-layout-sider>
</template>

<style lang="scss">
.ant-tree {
    background: transparent
}
.ant-tree-switcher {
    width: 24px!important;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
        padding: 5px;
    }
    span:hover {
        background-color: #ebebeb;
    }
}
.ant-tree .ant-tree-treenode {
    padding: 0;
}
.ant-tree-treenode {
    border-radius: 5px;
    transition: all 0.3s;
}
.ant-tree-treenode:hover{
    background-color: #f2f2f2;
}
.ant-tree.ant-tree-block-node .ant-tree-list-holder-inner .ant-tree-node-content-wrapper:hover {
    background: transparent;
}
.ant-tree-node-content-wrapper {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 !important;
    padding-right: 10px !important;
    overflow: hidden;
}
.ant-tree-treenode-selected {
    background-color: #ebebeb;
}
.ant-tree .ant-tree-node-content-wrapper {
    padding: 0 10px;
    display: flex;
}
.ant-tree-title {
    flex: 1;
}
.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: transparent;
    font-weight: 550;
    .ant-tree-switcher-noop {
        background-color: #ebebeb;
    }
}
</style>

<style lang="scss" scoped>

</style>
