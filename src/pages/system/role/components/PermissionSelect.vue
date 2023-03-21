<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { queryMenuTree } from '@/api/menu'
const props = defineProps({
  currentRole: {
    type: Object,
    default: () => { },
  },
  visible: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['handleSave', 'handleCancel'])
const fileName = {
  children: 'children',
  title: 'title',
  key: 'id',
}
const treeData = ref([])
const checkedKeys = ref([])
const checkPermissionKeys = ref([])
watchEffect(() => {
  if (props?.currentRole?.id) {
    const ids = props?.currentRole?.menus?.map((item: any) => item.id)
    const sonIds = deepTreeToList(treeData.value)
    const checked = sonIds.filter(item => ids.includes(item))
    checkedKeys.value = checked as any
    checkPermissionKeys.value = ids
  }
  else {
    checkedKeys.value = []
    checkPermissionKeys.value = []
  }
})

onMounted(() => {
  initData()
})

function deepTreeToList(tree: any[]) {
  const list: any[] = []
  const dfs = (tree: any[]) => {
    tree.forEach((item) => {
      if (item.children && item.children.length > 0) {
        dfs(item.children)
      }
      else {
        list.push(item.id)
      }
    })
  }
  dfs(tree)
  return list
}

async function initData() {
  const { queryMenuTree: data } = await queryMenuTree()
  treeData.value = data as any
}

function handleCheck(checkedKeys: string[], e: any) {
  const { halfCheckedKeys } = e
  checkPermissionKeys.value = [...halfCheckedKeys, ...checkedKeys] as any
}

function handleSave() {
  if (!props.currentRole.id) {
    message.info('请先选择角色')
    return
  }
  emits('handleSave', {
    id: props.currentRole.id,
    menuIds: checkPermissionKeys.value,
  })
}
</script>

<template>
  <a-drawer :visible="visible" title="权限配置" placement="right" @close="emits('handleCancel')">
    <template #extra>
      <a-button class="mr-2" @click="emits('handleCancel')">
        取消
      </a-button>
      <a-button type="primary" @click="handleSave">
        保存
      </a-button>
    </template>
    <div
      v-if="currentRole.name"
      class="mb-2 ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-100 text-xs font-semibold text-purple-800 dark:text-purple-800 rounded uppercase"
    >
      当前选择： {{ currentRole.name }}
    </div>
    <a-tree
      v-model:checkedKeys="checkedKeys" default-expand-all :selectable="false" :tree-data="treeData"
      :field-names="fileName" checkable @check="handleCheck"
    />
  </a-drawer>
</template>

<style lang="scss" scoped>
.permission_card {
    width: 100%;
    min-width: 300px;
    height: 600px;
    overflow: auto;
    margin-left: 24px;
}
</style>
