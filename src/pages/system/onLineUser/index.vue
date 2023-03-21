<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

<script setup lang="ts">
import type { TableColumnType } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { onMounted, reactive } from 'vue'
import TableSearchCard from './components/TableSearchCard.vue'
import { forceLogout, getOnLineUser } from '@/api/auth'
import type { ModelTypes } from '@/utils/graphql/zeus'

type IOnLineUser = ModelTypes['OnLineUser']
interface IState {
  pageNo: number
  pageSize: number
  total: number
  dataList: IOnLineUser[]
  loading: boolean
  searchParams: {
    name: string
    ip: string
  }
}
const columns: TableColumnType<IOnLineUser>[] = [
  {
    title: '会话ID',
    width: 200,
    align: 'center',
    dataIndex: 'token',
    key: 'token',
  },
  {
    title: '登录用户',
    width: 100,
    align: 'center',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '浏览器',
    align: 'center',
    width: 160,
    dataIndex: 'loginBrowser',
  },
  {
    title: '登录IP',
    align: 'center',
    width: 160,
    dataIndex: 'loginIp',
  },
  {
    title: '登录地址',
    align: 'center',
    width: 160,
    dataIndex: 'loginAddr',
  },
  {
    title: '登录时间',
    align: 'center',
    width: 160,
    dataIndex: 'loginTime',
  },
  {
    title: '操作',
    width: 180,
    fixed: 'right',
    key: 'operation',
    align: 'center',
  },
]

const state = reactive<IState>({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  dataList: [],
  loading: false,
  searchParams: {
    name: '',
    ip: '',
  },
})
onMounted(() => {
  initData()
})
async function initData() {
  state.loading = true
  const { searchParams: { ip, name } } = state
  const { getOnLineLoginUserList } = await getOnLineUser(ip, name)
  state.dataList = getOnLineLoginUserList
  state.loading = false
}

async function handleForceLogout(token: string) {
  await forceLogout(token)
  message.success('成功')
  initData()
}

function handleSearch(params: { name: string; ip: string }) {
  state.searchParams = params
  initData()
}
</script>

<template>
  <div class="online-user-container">
    <TableSearchCard @handle-search="handleSearch" />
    <div class="table-header">
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
      :pagination="true" :scroll="{ x: 1500 }" :columns="columns" :row-key="(record: any) => record.id"
      :data-source="state.dataList" :loading="state.loading"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'loginTime'">
          <span v-time>
            {{ record.loginTime }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'token'">
          <a-tooltip>
            <template #title>
              {{ record.token }}
            </template>
            <div class="w-[250px] line-clamp-1">
              {{ record.token }}
            </div>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a-popconfirm
              :title="`确定要强制下线用户${record.username}?`" ok-text="确定" cancel-text="取消"
              @confirm="handleForceLogout(record.token)"
            >
              <a>强退</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style lang="scss" scoped>
    .search-card {
      margin-bottom: 16px;
      background: #fff;
    }

    .online-user-container {
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

      .pagination-card{
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
