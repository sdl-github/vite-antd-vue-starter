<script setup lang="ts">
import { ref } from 'vue'
import FilePond from '@/components/FilePond/index.vue'
const props = defineProps({
  modalVisible: {
    type: Boolean,
    default: false,
  },
  currentItem: {
    type: Object,
    default: () => {
    },
  },
})

const emits = defineEmits(['update:modalVisible', 'handleOk'])

const confirmLoading = ref(false)

function handleOk() {
  emits('handleOk')
}

function handleCancel() {
  emits('update:modalVisible', false)
}
</script>

<template>
  <a-modal
    :visible="modalVisible" :destroy-on-close="true" title="上传"
    :confirm-loading="confirmLoading" :width="600" ok-text="保存" cancel-text="取消" @ok="handleOk" @cancel="handleCancel"
  >
    <FilePond :max-files="10" :allow-multiple="true" />
  </a-modal>
</template>

  <style lang="scss" scoped>
  </style>
