<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { queryAllRoleList } from '@/api/role'

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
  const { queryAllRoleList: data } = await queryAllRoleList()
  options.value = data?.map((item) => {
    return { label: item.name, value: item.id }
  })
  loading.value = false
}

function handleChange(v: Array<string>) {
  emits('update:value', v)
}
</script>

<template>
  <ASpin :spinning="loading">
    <ASelect :value="value" mode="tags" style="width: 100%" placeholder="请选择" :options="options" @change="handleChange" />
  </ASpin>
</template>

<style lang="scss" scoped></style>
