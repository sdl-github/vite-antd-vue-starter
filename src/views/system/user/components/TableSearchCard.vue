<template>
  <a-card :bordered="false">
    <a-row :gutter="[16, 16]">
      <a-col :md="9" :sm="24">
        <a-form-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          label="名称"
        >
          <a-input v-model:value="form.username" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <a-col :md="9" :sm="24">
        <a-form-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          label="手机"
        >
          <a-input v-model:value="form.phone" placeholder="请输入" />
        </a-form-item>
      </a-col>
      <template v-if="advanced">
        <a-col :md="9" :sm="24">
          <a-form-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 18 }"
            label="邮箱"
          >
            <a-input v-model:value="form.email" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :md="9" :sm="24">
          <a-form-item
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 18 }"
            label="创建时间"
          >
            <a-range-picker style="width: 100%" v-model:value="form.from" />
          </a-form-item>
        </a-col>
      </template>
      <a-col :md="6" :sm="24">
        <span>
          <a-button @click="handleSearch" type="primary">
            <template #icon>
              <SearchOutlined />
            </template>
            <span>搜索</span>
          </a-button>
          <a-button>
            <template #icon>
              <RedoOutlined />
            </template>
            <span>重置</span>
          </a-button>
          <a @click="advanced = !advanced">
            <span>
              {{ advanced ? "收起" : "展开" }}
            </span>
            <span>
              <UpOutlined v-if="advanced" />
              <DownOutlined v-else />
            </span>
          </a>
        </span>
      </a-col>
    </a-row>
  </a-card>
</template>
<script setup lang="ts">
import { UserQueryInput } from "@/api/user";
import {
  UpOutlined,
  DownOutlined,
  SearchOutlined,
  RedoOutlined,
} from "@ant-design/icons-vue";
import { log } from "console";
import { ref } from "vue";
const form = ref<UserQueryInput>({
  username: "",
  phone: "",
  email: "",
  from: "",
  to: "",
});
const advanced = ref(true);
const emits = defineEmits(["handleSearch"]);
function handleSearch() {
  console.log(form.value);
}
</script>

<style lang="scss" scoped>
</style>
