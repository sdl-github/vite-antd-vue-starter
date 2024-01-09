<route lang="yaml">
  meta:
    layout: dashboard
  </route>

<script setup lang="ts">
import type { TableColumnType } from 'ant-design-vue'
import { Table, message } from 'ant-design-vue'
import type { SorterResult } from 'ant-design-vue/es/table/interface'
import { onMounted, reactive, toRefs } from 'vue'

import { columns } from './data'
import type { Point, SearchParam } from './data'
import { deletePoint, queryPointPage } from '~/api/point'
import { DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE } from '@/constants'

interface State {
  loading: boolean
  modalVisible: boolean
  data: Point[]
  currentItem: Point | null
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
    type: undefined,
    createdAtFrom: '',
    createdAtTo: '',
    nickName: '',
  }
  return search
}

// 初始化数据
async function initData() {
  state.loading = true
  const { search } = state
  const { content, totalElements } = await queryPointPage(search)
  state.data = content as Point[]
  state.total = totalElements as number
  state.loading = false
}

// 打开编辑
function handleOpenEdit(record: Point) {
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
    await deletePoint(id)
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
  <div class="point-container">
    <UserModal v-model:open="state.modalVisible" :current-item="state.currentItem" @ok="initData" />
    <ACard>
      <div class="flex">
        <AInput v-model:value="search.nickName" placeholder="用户姓名" class="w-200px" />
        <ASelect v-model:value="search.type" class="ml-2 w-200px" placeholder="请选择">
          <ASelectOption :value="1">
            轨迹回放
          </ASelectOption>
          <ASelectOption :value="2">
            实时数据定位点
          </ASelectOption>
        </ASelect>
        <ADatePicker
          v-model:value="search.createdAtFrom" placeholder="开始时间" :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" class="ml-2"
        />
        <ADatePicker
          v-model:value="search.createdAtTo" placeholder="结束时间" :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" class="ml-2"
        />

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
      :pagination="false" :scroll="{ x: 1500 }" :columns="columns" :row-key="(record: any) => record.id"
      :data-source="state.data" :loading="state.loading" @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }: { column: TableColumnType<Point>, record: Point }">
        <template v-if="column.dataIndex === 'user'">
          <span>
            {{ record.user?.nickName }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'type'">
          <span>
            {{ record.type === 1 ? '轨迹回放' : '实时数据定位点' }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'file'">
          <span>
            {{ record.file?.url }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDate(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a @click="handleOpenEdit(record)">编辑</a>
            <ADivider type="vertical" />
            <APopconfirm :title="`确定要删除${record.id}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id!)">
              <a>删除</a>
            </APopconfirm>
          </span>
        </template>
      </template>
    </Table>
    <div class="pagination-card">
      <APagination
        v-model:pageSize="search.pageSize" :current="search.pageNo" show-size-changer :total="state.total"
        :show-total="() => `共 ${state.total} 条`" @change="handleShowSizeChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
  background: #fff;
}

.point-container {
  width: 100%;
  padding: 10px;

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
