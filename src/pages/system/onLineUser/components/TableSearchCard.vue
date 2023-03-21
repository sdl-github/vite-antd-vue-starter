<template>
  <a-card class="search_card" :bordered="false">
    <a-input class="search-item" v-model:value="form.name" placeholder="请输入用户名" />
    <a-input class="search-item" v-model:value="form.ip" placeholder="请输入IP" />
    <a-button class="search-btn" @click="handleSearch" type="primary">
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

<script setup lang="ts">
import { SearchOutlined, RedoOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";

const form = ref({
  name: "",
  ip: ""
});

const emits = defineEmits(["handleSearch"]);

// 搜索
function handleSearch() {
  emits('handleSearch', form)
}

// 重置搜索
function handleResetSearch() {
  form.value = {
    name: '',
    ip: ''
  };
  emits('handleSearch', form)
}

</script>

<style lang="scss" scoped>
.search-item {
  width: 200px;
  margin-left: 20px;
}

.search-btn {
  margin-left: 20px;
}
</style>