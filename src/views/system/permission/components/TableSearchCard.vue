<template>
  <a-card class="search_card" :bordered="false">
    <a-input class="search-item" v-model:value="form.name" placeholder="请输入名称" />
    <a-select class="search-item" v-model:value="form.type" placeholder="菜单类型">
      <a-select-option value="FUN">权限</a-select-option>
      <a-select-option value="MENU">菜单</a-select-option>
    </a-select>
    <a-button class="search-btn" @click="emits('handleSearch', form)" type="primary">
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
import { ref } from "vue";
import { SearchOutlined, RedoOutlined } from "@ant-design/icons-vue";
import { QueryMenuInput } from "@/api/menu";

const form = ref<QueryMenuInput>({
  id: "",
  name: "",
  from: "",
  to: "",
});

const emits = defineEmits(["handleSearch"]);

// 重置搜索
function handleResetSearch() {
  form.value = {
    id: "",
    name: "",
    from: "",
    to: "",
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

