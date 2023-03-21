<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { queryRolePage } from '@/api/role'

defineProps({
  value: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:value'])
const loading = ref(true)
const options = ref<SelectProps['options']>()
onMounted(() => {
  initData()
})

async function initData() {
  loading.value = true
  const { queryRolePage: { data } } = await queryRolePage()
  options.value = data?.map((item) => {
    return { label: item.name, value: item.id }
  })
  loading.value = false
}

function handleChange(v: Array<String>) {
  emits('update:value', v)
}
</script>

<template>
  <a-spin :spinning="loading">
    <a-select :value="value" mode="tags" style="width: 100%" placeholder="请选择" :options="options" @change="handleChange" />
  </a-spin>
</template>

<style lang="scss" scoped></style>
