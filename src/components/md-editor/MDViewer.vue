<script setup lang="ts">
import { Viewer } from '@bytemd/vue-next'
import { plugins } from './plugins/index'
import './theme/smart-blue.css'

defineProps({
  value: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <Viewer :plugins="plugins" :value="value" />
</template>
