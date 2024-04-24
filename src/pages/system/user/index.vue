<route lang="yaml">
meta:
  layout: dashboard
</route>

<script setup lang="ts">
import type { TableColumnType } from 'ant-design-vue'
import { Table, message } from 'ant-design-vue'
import type { SorterResult } from 'ant-design-vue/es/table/interface'
import { onMounted, reactive, toRefs } from 'vue'
import type { SearchParam, User } from './data'
import { GenderEnum, columns } from './data'
import UserModal from './components/UserModal.vue'

import { deleteUser, queryUserPage } from '~/api/user'
import { DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE } from '@/constants'

interface State {
  loading: boolean
  modalVisible: boolean
  data: User[]
  currentItem: User | null
  search: SearchParam
  total: number
}
const state: State = reactive({
  loading: false,
  modalVisible: false,
  currentItem: null,
  data: [],
  search: generateSearch(),
  total: 0,
})

const { search } = toRefs(state)

onMounted(() => {
  initData()
})

function generateSearch() {
  const search: SearchParam = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    userName: '',
    nickName: '',
    phone: '',
    email: '',
    roleIds: [],
    sort: '',
  }
  return search
}

// 初始化数据
async function initData() {
  state.loading = true
  const { search } = state
  const res = await queryUserPage(search)
  const { content, totalElements } = res.queryUserPage!
  state.data = content as User[]
  state.total = totalElements as number
  state.loading = false
}

// 打开编辑
function handleOpenEdit(record: User) {
  state.currentItem = record
  state.modalVisible = true
}
// 打开创建
function handleOpenCreate() {
  state.modalVisible = true
}

// 删除请求
async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await deleteUser(id)
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

// 搜索回调
function handleSearch() {
  handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE)
}

function handleReset() {
  state.search = generateSearch()
  handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE)
}
// 分页回调
function handleShowSizeChange(current: number, pageSize: number) {
  search.value.pageNo = current
  search.value.pageSize = pageSize
  initData()
}

function handleTableChange(pagination: any, filters: any, sorter: SorterResult) {
  const sortType = {
    ascend: 'asc',
    descend: 'desc',
  }
  const { order, field } = sorter
  if (!order) {
    search.value.sort = ''
    initData()
    return
  }
  const sort = sortType[order!]
  search.value.sort = `${field} ${sort}`
  initData()
}
</script>

<template>
  <div class="user-container">
    <UserModal
      v-model:open="state.modalVisible"
      :current-item="state.currentItem"
      @ok="initData();state.currentItem = null"
      @cancel="state.currentItem = null"
    />
    <ACard>
      <div class="flex">
        <AInput v-model:value="search.userName" placeholder="用户名" class="w-200px" />
        <AInput v-model:value="search.nickName" placeholder="姓名" class="ml-4 w-200px" />
        <AInput v-model:value="search.phone" placeholder="手机" class="ml-4 w-200px" />
        <AInput v-model:value="search.email" placeholder="邮箱" class="ml-4 w-200px" />
        <div class="ml-2 flex items-center">
          <AButton :loading="state.loading" class="flex items-center justify-center" type="primary" @click="handleSearch">
            <template #icon>
              <div class="i-ri-search-line mr-2" />
            </template>
            <div>
              查询
            </div>
          </AButton>
          <AButton style="margin-left: 10px" @click="handleReset">
            重置
          </AButton>
        </div>
      </div>
    </ACard>
    <div class="table-header">
      <AButton type="primary" @click="handleOpenCreate">
        新建
      </AButton>
      <div class="table-action">
        <ATooltip placement="top">
          <template #title>
            <span>刷新</span>
          </template>
          <AButton class="flex items-center justify-center" type="text" shape="circle" @click="initData">
            <div class="i-ri-refresh-line" />
          </AButton>
        </ATooltip>
      </div>
    </div>
    <Table
      :pagination="false"
      :scroll="{ x: 1500 }"
      :columns="columns"
      :row-key="(record: any) => record.id"
      :data-source="state.data" :loading="state.loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }: { column: TableColumnType<User>, record: User }">
        <template v-if="column.dataIndex === 'avatar'">
          <span>
            <AAvatar :src="record.avatar">{{ record.userName }}</AAvatar>
          </span>
        </template>
        <template v-if="column.dataIndex === 'gender' && record.gender">
          <span>
            {{ GenderEnum[record.gender] }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDate(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'roles'">
          <span v-if="record.roles!.length > 0 ">
            <ATag v-for="role in record.roles" :key=" role?.id " style="margin: 5px" color="blue">{{ role?.name
            }}</ATag>
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a @click="handleOpenEdit(record) ">编辑</a>
            <ADivider type="vertical" />
            <APopconfirm
              :title="`确定要删除${record.userName}?`" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a>删除</a>
            </APopconfirm>
          </span>
        </template>
      </template>
    </Table>
    <div class="pagination-card">
      <APagination
        v-model:pageSize="search.pageSize"
        :current="search.pageNo" show-size-changer
        :total=" state.total"
        :show-total=" () => `共 ${state.total} 条`"
        @change="handleShowSizeChange "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
  background: #fff;
}

.user-container {
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
