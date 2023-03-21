<template>
    <a-modal :visible="modalVisible" :destroy-on-close="true" title="上传"
      :confirm-loading="confirmLoading" :width="600" okText='保存' cancelText='取消' @ok="handleOk" @cancel='handleCancel'>
      <FilePond :max-files="10" :allow-multiple="true"/>
    </a-modal>
  </template>
  <script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
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
  });

  const confirmLoading = ref(false)

  const emits = defineEmits(['update:modalVisible', 'handleOk'])
  
  function handleOk() {
    emits('handleOk')
  }
  
  function handleCancel() {
    emits('update:modalVisible', false)
  }
  
  </script>
  
  <style lang="scss" scoped>
  </style>
  