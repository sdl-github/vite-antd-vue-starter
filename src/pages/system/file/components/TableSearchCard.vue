<script setup lang="ts">
import { RedoOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import dayjs from 'dayjs'
import type { FileQueryArg } from '@/api/file'

const emits = defineEmits(['handleSearch'])
const date = ref()
const form = ref<FileQueryArg>({
  fileName: '',
  originalName: '',
  from: '',
  to: '',
})

// 搜索
function handleSearch() {
  if (date.value && date.value.length > 0) {
    form.value.from = dayjs(date.value[0]).format('YYYY-MM-DD')
    form.value.to = dayjs(date.value[1]).format('YYYY-MM-DD')
  }
  emits('handleSearch', form)
}
// 重置搜索
function handleResetSearch() {
  date.value = []
  form.value = {
    fileName: '',
    originalName: '',
    from: '',
    to: '',
  }
  emits('handleSearch', form)
}
</script>

<template>
  <a-card class="search_card flex" :bordered="false">
    <a-input v-model:value="form.fileName" class="search-item" placeholder="请输入文件名" />
    <a-input v-model:value="form.originalName" class="search-item" placeholder="请输入原始文件名" />
    <a-range-picker v-model:value="date" class="search-item" />
    <a-button class="search-btn" type="primary" @click="handleSearch">
      <template #icon>
        <SearchOutlined />
      </template>
      <span>搜索</span>
    </a-button>
    <a-button class="search-btn" @click="handleResetSearch">
      <template #icon>
        <RedoOutlined />
      </template>
      <span>重置</span>
    </a-button>
  </a-card>
</template>

<style lang="scss" scoped>
.search-item{
  width: 200px;
  margin-left: 20px;
}
.search-btn{
  margin-left: 20px;
}
</style>
