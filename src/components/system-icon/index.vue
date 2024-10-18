<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'

interface iconProps {
  /* 图标名称 */
  icon?: string
}
const { icon } = defineProps<iconProps>()
const attrs = useAttrs()

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || '',
}))

const isLocal = computed(() => {
  return icon && icon.startsWith('local:')
})

const symbolId = computed(() => {
  const defaultLocalIcon = 'no-icon'
  return `#${icon || defaultLocalIcon}`
})
</script>

<template>
  <span
    v-if="icon"
    class="inline-block"
  >
    <template v-if="isLocal">
      <svg aria-hidden="true" width="1.2em" height="1.2em" v-bind="bindAttrs">
        <use :xlink:href="symbolId" fill="currentColor" />
      </svg>
    </template>
    <template v-else>
      <IconifyIcon :icon="icon" v-bind="bindAttrs" />
    </template>
  </span>
</template>
