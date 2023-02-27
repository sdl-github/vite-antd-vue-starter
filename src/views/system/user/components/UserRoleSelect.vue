<template>
  <a-spin :spinning="loading">
    <a-select :value="value" mode="tags" style="width: 100%" placeholder="请选择" @change="handleChange" :options="options">
    </a-select>
  </a-spin>
</template>
<script setup lang="ts">
import { SelectProps } from "ant-design-vue";
import { onMounted, ref } from "vue";
import { queryRolePage } from "@/api/role";

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
});

const loading = ref(true)
const emits = defineEmits(['update:value'])
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

<style lang="scss" scoped></style>
