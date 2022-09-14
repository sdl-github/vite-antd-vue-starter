<template>
  <a-card class="search_card" :bordered="false">
    <a-row :gutter="[16, 16]">
      <a-col :md="9" :sm="24">
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" label="用户名">
          <a-input v-model:value="form.name" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :md="9" :sm="24">
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" label="IP">
          <a-input v-model:value="form.ip" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :md="6" :sm="24">
        <span style="display: flex;">
          <a-button @click="handleSearch" type="primary">
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
</style>
