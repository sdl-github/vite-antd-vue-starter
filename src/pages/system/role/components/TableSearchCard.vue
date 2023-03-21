<script setup lang="ts">
import { RedoOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

const emits = defineEmits(['handleSearch'])

const form = ref({
  name: '',
})

// 搜索
function handleSearch() {
  emits('handleSearch', form)
}
// 重置搜索
function handleResetSearch() {
  form.value = {
    name: '',
  }
  emits('handleSearch', form)
}
</script>

<template>
  <a-card class="search_card flex" :bordered="false">
    <a-input v-model:value="form.name" class="search-item" placeholder="请输入名称" />
    <a-button class="search-btn" type="primary" @click="handleSearch">
      <template #icon>
        <SearchOutlined />
      </template>
      <span>搜索</span>
    </a-button>
    <a-button class="search-btn" style="margin-left:20px" @click="handleResetSearch">
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
