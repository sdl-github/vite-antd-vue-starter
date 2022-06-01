<template>
  <a-card class="search_card" :bordered="false">
    <a-row :gutter="[16, 16]">
      <a-col :md="9" :sm="24">
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" label="名称">
          <a-input v-model:value="form.username" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :md="9" :sm="24">
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" label="手机">
          <a-input v-model:value="form.phone" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :md="9" :sm="24">
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" label="邮箱">
          <a-input v-model:value="form.email" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :md="9" :sm="24">
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" label="创建时间">
          <a-range-picker v-model:value="date" style="width: 100%" />
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
import { UserQueryInput } from "@/api/user";
import { SearchOutlined, RedoOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import dayjs from 'dayjs'

const date = ref();
const form = ref<UserQueryInput>({
  username: "",
  phone: "",
  email: "",
  from: "",
  to: "",
});

const emits = defineEmits(["handleSearch"]);

// 搜索
function handleSearch() {
  if (date.value && date.value.length > 0) {
    form.value.from = dayjs(date.value[0]).format("YYYY-MM-DD");
    form.value.to = dayjs(date.value[1]).format("YYYY-MM-DD");
  }
  emits('handleSearch', form)
}
// 重置搜索
function handleResetSearch() {
  date.value = [];
  form.value = {
    username: "",
    phone: "",
    email: "",
    from: "",
    to: "",
  };
  emits('handleSearch', form)
}

</script>

<style lang="scss" scoped>
</style>
