<template>
  <a-card class="search_card" :bordered="false">
    <a-row :gutter="[16, 16]">
      <a-col :md="9" :sm="24">
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" label="名称">
          <a-input v-model:value="form.name" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <span style="display: flex;">
          <a-button @click="emits('handleSearch', form)" type="primary">
            <template #icon>
              <SearchOutlined />
            </template>
            <span>搜索</span>
          </a-button>
          <a-button @click="handleResetSearch" style="margin-left:20px">
            <template #icon>
              <RedoOutlined />
            </template>
            <span>重置</span>
          </a-button>
        </span>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {QueryMenuInput} from "@/api/menu";

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
</style>
