
<template>
   <a-modal
      v-model:visible="modalVisible"
      :title="currentItem?.id ? '编辑':' 创建'"
      :confirm-loading="confirmLoading"
      okText='确定'
      cancelText='取消'
      @ok="handleOk"
      @cancel='handleCancel'
    >
      <p>test</p>
    </a-modal>
</template>
<script setup lang="ts">
import {ref} from 'vue'
defineProps({
  modalVisible: {
    type: Boolean,
    default: false,
  },
  currentItem: {
    type: Object,
    default: () => {},
  },
});

const confirmLoading = ref(false)
const emits = defineEmits(['handleModalVisible'])
function handleOk() {
}

function handleCancel() {
  emits('handleModalVisible',false)
}
</script>

<style lang="scss" scoped>
</style>
