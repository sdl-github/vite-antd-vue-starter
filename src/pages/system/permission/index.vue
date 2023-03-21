<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import type { ICreateMenuInput, IEditMenuInput, IMenu, IState } from './data'
import PermissionModal from './components/PermissionModal.vue'
import TableSearchCard from './components/TableSearchCard.vue'
import { createMenu, deleteMenu, queryMenuTree, updateMenu } from '@/api/menu'
import type { QueryMenuInput } from '@/api/menu'

enum PermissionTypeEnum {
  MENU = '菜单',
  FUN = '权限',
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
  searchParams: {},
})

const columns: TableColumnType<IMenu>[] = [
  {
    title: '名称标识',
    align: 'center',
    width: 200,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '标题',
    align: 'center',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '排序',
    align: 'center',
    dataIndex: 'orderBy',
    key: 'orderBy',
  },
  {
    title: '图标',
    align: 'center',
    dataIndex: 'icon',
    key: 'icon',
  },
  {
    title: '是否可见',
    align: 'center',
    dataIndex: 'visible',
    key: 'visible',
  },
  {
    title: '路径',
    width: 150,
    align: 'center',
    ellipsis: true,
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '权限名称',
    width: 150,
    ellipsis: true,
    align: 'center',
    dataIndex: 'permission',
    key: 'permission',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '操作',
    width: 180,
    fixed: 'right',
    key: 'operation',
    align: 'center',
  },
]

onMounted(() => {
  initData()
})

// 初始化数据
async function initData() {
  state.loading = true
  const { searchParams } = state
  const { queryMenuTree: data } = await queryMenuTree(searchParams)
  state.dataList = data as unknown as IMenu[]
  state.loading = false
}

// 格式化时间
function formatDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function handleOpenCreate() {
  state.currentItem = {} as any
  state.modalVisible = true
}

function handleOpenEdit(record: IMenu) {
  state.currentItem = record
  state.modalVisible = true
}
function handleVisible(v: IMenu) {
  const { id, visible, name } = v
  const data = { id, visible, name }
  handleOk(data)
}

async function handleOk(v: IMenu) {
  let success
  if (v.id) {
    success = await handleUpdate(v)
  }
  else {
    success = await handleCreate(v)
  }
  if (success) {
    state.modalVisible = false
    await initData()
  }
}

// 编辑请求
async function handleUpdate(v: IEditMenuInput) {
  const loading = message.loading('加载中', 0)
  try {
    await updateMenu(v)
    loading()
    message.success('成功')
    return true
  }
  catch (e) {
    loading()
    return false
  }
}

// 创建请求
async function handleCreate(v: ICreateMenuInput) {
  const loading = message.loading('加载中', 0)
  try {
    await createMenu(v)
    loading()
    message.success('成功')
    return true
  }
  catch (e) {
    loading()
    return false
  }
}

// 删除请求
async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await deleteMenu([id])
    loading()
    initData()
    message.success('成功')
    return true
  }
  catch (e) {
    loading()
    return false
  }
}

function handleSearch(params: QueryMenuInput) {
  state.searchParams = params
  initData()
}
</script>

<template>
  <div class="permission-container">
    <TableSearchCard @handle-search="handleSearch" />
    <div class="table-header">
      <a-button type="primary" @click="handleOpenCreate">
        新建
      </a-button>
      <div class="table-action">
        <a-tooltip placement="top">
          <template #title>
            <span>刷新</span>
          </template>
          <a-button type="text" shape="circle" @click="initData">
            <div class="i-ri-refresh-line" />
          </a-button>
        </a-tooltip>
      </div>
    </div>
    <a-table
      :pagination="false" :scroll="{ x: 1500 }" :columns="columns" :row-key="(record: any) => record.id"
      :data-source="state.dataList" :loading="state.loading"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'type'">
          <span>
            {{ PermissionTypeEnum[record.type] }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'orderBy'">
          <span
            class="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-100 text-xs font-semibold text-purple-800 dark:text-purple-800 rounded uppercase"
          >
            {{ record.orderBy || '0' }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'icon'">
          {{ record.icon }}
        </template>
        <template v-if="column.dataIndex === 'visible'">
          <a-switch v-model:checked="record.visible" @change="handleVisible(record)" />
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDate(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a @click.stop="handleOpenEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              :title="`确定要删除[${record.name}]?`" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>
    <PermissionModal v-model:modalVisible="state.modalVisible" :current-item="state.currentItem" @handle-ok="handleOk" />
  </div>
</template>

<style lang="scss" scoped>
.permission-container {
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
