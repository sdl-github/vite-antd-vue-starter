<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { queryMenuTree } from '@/api/menu'

defineProps({
  value: {
    type: String,
    default: () => null,
  },
})
const emits = defineEmits(['update:value'])
const loading = ref(false)
const treeData = ref([])
onMounted(() => {
  initData()
})

async function initData() {
  loading.value = true
  const data = await queryMenuTree({ visible: true, sort: 'sort asc' })
  loading.value = false
  const node = [
    {
      id: '0',
      title: '根目录',
      value: '0',
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
  <ASpin :spinning="loading">
    <ATreeSelect
      show-search
      style="width: 100%"
      placeholder="请选择"
      allow-clear
      :value="value"
      :field-names="{
        children: 'children',
        label: 'title',
        value: 'id',
      }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      @change="handleChange"
    />
  </ASpin>
</template>
