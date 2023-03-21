<script setup lang="ts">
import { ref } from 'vue'
import { RedoOutlined, SearchOutlined } from '@ant-design/icons-vue'
import type { QueryMenuInput } from '@/api/menu'

const emits = defineEmits(['handleSearch'])

const form = ref<QueryMenuInput>({
  id: '',
  name: '',
  from: '',
  to: '',
})

// 重置搜索
function handleResetSearch() {
  form.value = {
    id: '',
    name: '',
    from: '',
    to: '',
  }
  emits('handleSearch', form)
}
</script>

<template>
  <a-card class="search_card" :bordered="false">
    <a-input v-model:value="form.name" class="search-item" placeholder="请输入名称" />
    <a-select v-model:value="form.type" class="search-item" placeholder="菜单类型">
      <a-select-option value="FUN">
        权限
      </a-select-option>
      <a-select-option value="MENU">
        菜单
      </a-select-option>
    </a-select>
    <a-button class="search-btn" type="primary" @click="emits('handleSearch', form)">
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
