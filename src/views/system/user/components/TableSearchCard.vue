<template>
  <a-card class="search_card flex" :bordered="false">
    <a-input class="search-item" v-model:value="form.username" placeholder="请输入用户名" />
      <a-input class="search-item" v-model:value="form.phone" placeholder="请输入手机" />
      <a-input class="search-item" v-model:value="form.email" placeholder="请输入邮箱" />
      <a-range-picker class="search-item" v-model:value="date" />
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
.search-item{
  width: 200px;
  margin-left: 20px;
}
.search-btn{
  margin-left: 20px;
}
</style>
