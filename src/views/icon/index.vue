<template>
  <div class="icon-container">
    <a-alert message="点击图标即可复制代码" type="success" show-icon></a-alert>
    <a-row :gutter="20">
      <a-col
        v-for="(item, index) in state.data"
        :key="index"
        :lg="2"
        :md="3"
        :sm="8"
        :xl="2"
        :xs="6"
      >
        <a-card shadow="hover" @click="handleCopyIcon(item, $event)">
          <RemixIcon :icon="item" />
        </a-card>
        <div class="icon-text">
          {{ item }}
        </div>
      </a-col>
    </a-row>
    <div class="page">
      <a-pagination
        v-model:current="state.pageNo"
        :total="state.totalCount"
        @change="handleCurrentChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { getIconList } from "@/assets/icon";
import { reactive } from "vue";
import RemixIcon from "@/components/RemixIcon.vue";
import { handleClipboard } from "@/utils/tools";
import { message } from "ant-design-vue";
const state = reactive({
  data: [],
  pageNo: 1,
  pageSize: 64,
  totalCount: 0,
  nameLike: "",
});

const handleInitData = () => {
  const { pageNo, pageSize, nameLike } = state;
  const { data, totalCount } = getIconList(pageNo, pageSize, nameLike);
  if (data && data.length > 0) {
    // @ts-ignore
    state.data = [...state.data, ...data];
    state.totalCount = totalCount;
  }
};
const handleCopyIcon = (item: string, e: any) => {
  handleClipboard(`<RemixIcon :icon="${item}" />`, e);
  message.success(`成功`);
};
const handleCurrentChange = (val: number) => {
  state.pageNo = val;
  handleInitData();
};
const handlePageSizeChange = (val: number) => {
  state.pageSize = val;
  handleInitData();
};
handleInitData();
</script>

<style lang="scss">
.icon-container {
  .ant-input-search,
  .ant-alert {
    margin-bottom: 20px;
  }

  .ant-card-body {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 68px;
    cursor: pointer;

    i {
      font-size: 28px;
      text-align: center;
      pointer-events: none;
      cursor: pointer;
    }
  }

  .icon-text {
    height: 30px;
    overflow: hidden;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .page {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>