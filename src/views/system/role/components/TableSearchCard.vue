<template>
  <a-card class="search_card flex" :bordered="false">
    <a-input class="search-item"  v-model:value="form.name" placeholder="请输入名称" />
    <a-button class="search-btn" @click="handleSearch" type="primary">
      <template #icon>
        <SearchOutlined />
      </template>
      <span>搜索</span>
    </a-button>
    <a-button class="search-btn" @click="handleResetSearch" style="margin-left:20px">
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
});

const emits = defineEmits(["handleSearch"]);

// 搜索
function handleSearch() {
  emits('handleSearch', form)
}
// 重置搜索
function handleResetSearch() {
  form.value = {
    name: "",
  };
  emits('handleSearch', form)
}

</script>

<style lang="scss" scoped>
.search-item{
  width: 200px;
  margin-left: 20px;
}
.search-btn{
  margin-left: 20px;
}
</style>
