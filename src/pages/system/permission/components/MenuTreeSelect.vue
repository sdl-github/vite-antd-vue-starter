<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { queryMenuTree } from '@/api/menu'
const props = defineProps({
  value: {
    type: String,
  },
})
const emits = defineEmits(['update:value'])
const treeData = ref([])
onMounted(() => {
  initData()
})

async function initData() {
  const { queryMenuTree: data } = await queryMenuTree()
  const node = [
    {
      id: '#',
      title: '根目录',
      value: '',
      children: data,
    },
  ]
  treeData.value = node as any
}

function handleChange(value: string) {
  emits('update:value', value)
}
</script>

<template>
  <a-tree-select
    :value="value" show-search style="width: 100%" :field-names="{
      children: 'children',
      label: 'title',
      value: 'id',
    }" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择" allow-clear :tree-data="treeData" @change="handleChange"
  />
</template>
