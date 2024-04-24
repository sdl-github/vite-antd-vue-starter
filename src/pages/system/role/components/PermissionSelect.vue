<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, ref, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { queryMenuTree } from '@/api/menu'
import type { ModelTypes } from '@/utils/graphql/zeus'

const props = defineProps({
  currentRole: {
    type: Object as PropType<ModelTypes['Role']>,
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
const checkedKeys = ref<string[]>([])
const checkPermissionKeys = ref<string[]>([])
watchEffect(() => {
  if (props?.currentRole?.id) {
    const ids = props?.currentRole?.menus?.map(item => item?.id)
    const sonIds = deepTreeToList(treeData.value)
    const checked = sonIds.filter(item => ids?.includes(item))
    checkedKeys.value = checked as string[]
    checkPermissionKeys.value = ids as string[]
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
      if (item.children && item.children.length > 0)
        dfs(item.children)

      else
        list.push(item.id)
    })
  }
  dfs(tree)
  return list
}

async function initData() {
  const data = await queryMenuTree({
    sort: 'createdAt desc',
  })
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
  <ADrawer :visible="visible" title="权限配置" placement="right" @close="emits('handleCancel')">
    <template #extra>
      <AButton class="mr-2" @click="emits('handleCancel')">
        取消
      </AButton>
      <AButton type="primary" @click="handleSave">
        保存
      </AButton>
    </template>
    <div
      v-if="currentRole.name"
      class="mb-2 ml-2 rounded bg-purple-100 px-2 py-1 text-xs font-semibold uppercase text-purple-800 dark:bg-purple-100 dark:text-purple-800"
    >
      当前选择： {{ currentRole.name }}
    </div>
    <ATree
      v-model:checkedKeys="checkedKeys" default-expand-all :selectable="false" :tree-data="treeData"
      :field-names="fileName" checkable @check="handleCheck"
    />
  </ADrawer>
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
