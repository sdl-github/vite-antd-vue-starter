<template>
  <div class="container">
    <TableSearchCard @handleSearch="handleSearch"/>
    <div class="table-header">
      <a-button @click='handleOpenCreate' type="primary">新建</a-button>
      <div class="table-action">
        <a-tooltip placement="top">
          <template #title>
            <span>刷新</span>
          </template>
          <a-button @click="initData" type="text" shape="circle">
            <RemixIcon icon="refresh-line"/>
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
          <RemixIcon :icon="record.icon"/>
        </template>
        <template v-if="column.dataIndex === 'visible'">
          <a-switch @change="handleOk(record)" v-model:checked="record.visible"/>
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDate(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a @click.stop='handleOpenEdit(record)'>编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm :title="`确定要删除[${record.name}]?`" @confirm="handleDelete(record.id)" ok-text="确定" cancel-text="取消">
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
import {queryMenuTree, createMenu, updateMenu, QueryMenuInput, deleteMenu} from '@/api/menu';
import {onMounted, reactive} from 'vue';
import {ICreateMenuInput, IEditMenuInput, IMenu, IState} from './data';
import {message, TableColumnType} from "ant-design-vue";
import TableSearchCard from './components/TableSearchCard.vue'
import RemixIcon from '@/components/RemixIcon.vue';
import PermissionModal from './components/PermissionModal.vue';
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
  searchParams: {}
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
    ellipsis: true,
    dataIndex: "path",
    key: "path",
  },
  {
    title: "权限名称",
    width: 150,
    ellipsis: true,
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
  const {searchParams} = state
  const {getMenuTree} = await queryMenuTree(searchParams);
  state.dataList = getMenuTree as unknown as IMenu[];
  state.loading = false;
}

// 格式化时间
function formatDate(date: string) {
  return dayjs(date).format("YYYY-MM-DD HH:mm");
};

function handleOpenCreate() {
  state.currentItem = {} as any
  state.modalVisible = true;
}

function handleOpenEdit(record: IMenu) {
  state.currentItem = record;
  state.modalVisible = true;
}

async function handleOk(v: any) {
  console.log(v);
  let success;
  if (v.id) {
    success = await handleUpdate(v)
  } else {
    success = await handleCreate(v)
  }
  if (success) {
    state.modalVisible = false
    await initData()
  }
}

// 编辑请求
async function handleUpdate(v: IEditMenuInput) {
  const loading = message.loading('加载中', 0);
  try {
    await updateMenu(v)
    loading()
    message.success('成功');
    return true
  } catch (e) {
    loading()
    return false
  }
}

// 创建请求
async function handleCreate(v: ICreateMenuInput) {
  const loading = message.loading('加载中', 0);
  try {
    await createMenu(v)
    loading()
    message.success('成功');
    return true
  } catch (e) {
    loading()
    return false
  }
}

// 删除请求
async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0);
  try {
    await deleteMenu([id])
    loading()
    initData()
    message.success('成功');
    return true
  } catch (e) {
    loading()
    return false
  }
}

function handleSearch(params: QueryMenuInput) {
  state.searchParams = params
  initData()
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
