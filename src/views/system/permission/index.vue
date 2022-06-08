
<template>
  <a-table :pagination="false" :scroll="{ x: 1500 }" :columns="columns" :row-key="(record: any) => record.id" :data-source="state.dataList"
    :loading="state.loading">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'type'">
        <span>
          {{ PermissionTypeEnum[record.type] }}
        </span>
      </template>
      <template v-if="column.dataIndex === 'createdAt'">
        <span>
          {{ formatDate(record.createdAt) }}
        </span>
      </template>
      <template v-if="column.key === 'operation'">
        <span>
          <a>编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm :title="`确定要删除${record.username}?`" ok-text="确定" cancel-text="取消">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { queryMenuTree } from '@/api/menu';
import { onMounted, reactive } from 'vue';
import { IMenu, IState } from './data';
import type { TableColumnType } from "ant-design-vue";
import dayjs from 'dayjs';

enum PermissionTypeEnum {
  MENU = "菜单",
  FUN = "权限",
}
const state = reactive<IState>({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  dataList: [],
  loading: false,
  modalVisible: false,
  currentItem: {
    id: '',
    name: '',
  },
  searchParams: {

  }
});

const columns: TableColumnType<IMenu>[] = [
  {
    title: "名称",
    align: "center",
    fixed: "left",
    width: 200,
    dataIndex: "name",
    key: "name",
  },
  {
    title: "类型",
    align: "center",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "图标",
    align: "center",
    dataIndex: "icon",
    key: "icon",
  },
  {
    title: "是否可见",
    align: "center",
    dataIndex: "visible",
    key: "visible",
  },
  {
    title: "路径",
    width: 150,
    align: "center",
    dataIndex: "path",
    key: "path",
  },
  {
    title: "权限名称",
    width: 150,
    align: "center",
    dataIndex: "permission",
    key: "permission",
  },
  {
    title: "创建时间",
    align: "center",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "操作",
    width: 180,
    fixed: "right",
    key: "operation",
    align: "center",
  },
]

onMounted(() => {
  initData();
});

// 初始化数据
async function initData() {
  state.loading = true;
  const { getMenuTree } = await queryMenuTree();
  console.log(getMenuTree);

  state.dataList = getMenuTree as unknown as IMenu[];
  state.loading = false;
}

// 格式化时间
function formatDate(date: string) {
  return dayjs(date).format("YYYY-MM-DD HH:mm");
};
</script>

<style lang="scss" scoped>
</style>
