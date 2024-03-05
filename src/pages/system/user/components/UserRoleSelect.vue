<script setup lang="ts">
defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['update:value'])

function handleChange(v: Array<string>) {
  emits('update:value', v)
}
</script>

<template>
  <ASpin :spinning="!options">
    <ASelect :value="value" mode="tags" style="width: 100%" placeholder="请选择" :options="options" @change="handleChange" />
  </ASpin>
</template>

<style lang="scss" scoped></style>
