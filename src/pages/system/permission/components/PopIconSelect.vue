<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['update:value'])
const visible = ref(false)
function onSelect(value: string) {
  visible.value = false
  emits('update:value', value)
}
</script>

<template>
  <a-popover v-model:visible="visible" placement="bottom" trigger="click" destroy-tooltip-on-hide>
    <template #content>
      <div class="icon_select_content" />
    </template>
    <a-input placeholder="请选择" :value="value" />
  </a-popover>
</template>

<style lang="scss" scoped>
.icon_select_content {
    width: 400px;
    height: 300px;
    overflow: auto;
}
</style>
