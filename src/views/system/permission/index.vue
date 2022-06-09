
<template>
  <div class="container">
    <div class="table-header">
      <a-button @click='handleOpenCreate' type="primary">新建</a-button>
      <div class="table-action">
        <a-tooltip placement="top">
          <template #title>
            <span>刷新</span>
          </template>
          <a-button @click="initData" type="text" shape="circle">
            <RemixIcon icon="refresh-line" />
          </a-button>
        </a-tooltip>
      </div>
    </div>
    <a-table :pagination="false" :scroll="{ x: 1500 }" :columns="columns" :row-key="(record: any) => record.id"
      :data-source="state.dataList" :loading="state.loading">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'type'">
          <span>
            {{ PermissionTypeEnum[record.type] }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'icon'">
          <RemixIcon :icon="record.icon" />
        </template>
        <template v-if="column.dataIndex === 'visible'">
          <a-switch v-model:checked="record.visible" />
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
    <PermissionModal :current-item="state.currentItem" v-model:modalVisible='state.modalVisible' @handleOk="handleOk"/>
  </div>

</template>
<script setup lang="ts">
import { queryMenuTree } from '@/api/menu';
import { onMounted, reactive } from 'vue';
import { IMenu, IState } from './data';
import type { TableColumnType } from "ant-design-vue";
import RemixIcon from '@/components/RemixIcon.vue';
import PermissionModal from './components/PermissionModal.vue';
import dayjs from 'dayjs';
import RemixIconSelect from '@/components/RemixIconSelect/index.vue';

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

function handleOpenCreate() {
  state.modalVisible = true;
}

function handleOk() {
  state.modalVisible = false;
  initData();
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;

  .table-header {
    height: 64px;
    padding: 16px 0;
    display: flex;
    justify-content: flex-end;
  }

  .table-action {
    display: flex;
    align-items: center;
    margin-left: 16px;
  }

  .pagination-card {
    height: 60px;
    width: 100%;
    background: #fff;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
  }
}
</style>
