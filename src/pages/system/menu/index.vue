<route lang="yaml">
meta:
  layout: dashboard
</route>

<script setup lang="ts">
import type { TableColumnType } from 'ant-design-vue'
import { Table, message } from 'ant-design-vue'
import type { SorterResult } from 'ant-design-vue/es/table/interface'
import type { Menu, SearchParam } from './data'
import { columns } from './data'

import MenuModal from './components/MenuModal.vue'
import { MenuTypeEnum } from '@/utils/graphql/zeus'
import { deleteMenu, queryMenuTree, updateMenu } from '@/api/menu'

interface State {
  loading: boolean
  modalVisible: boolean
  data: Menu[]
  currentItem: Menu | null
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
    name: '',
    title: '',
    sort: 'sort asc',
  }
  return search
}

// 初始化数据
async function initData() {
  state.loading = true
  const { search } = state
  const content = await queryMenuTree(search)
  state.data = content as Menu[]
  state.loading = false
}

// 打开编辑
function handleOpenEdit(record: Menu) {
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
    await deleteMenu(id)
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
  initData()
}

function handleReset() {
  state.search = generateSearch()
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

async function handleChangeVisible(record: Menu) {
  const loading = message.loading('加载中', 0)
  const { id, visible } = record
  if (!id)
    return

  try {
    await updateMenu({ id, visible })
    loading()
    message.success('成功')
    return true
  }
  catch (e) {
    loading()
    return false
  }
}
</script>

<template>
  <div class="Menu-container">
    <MenuModal
      v-model:open="state.modalVisible"
      :current-item="state.currentItem"
      @ok="initData"
      @cancel="state.currentItem = {}"
    />
    <ACard>
      <div class="flex">
        <AInput v-model:value="search.title" placeholder="标题" class="w-200px" />
        <AInput v-model:value="search.name" placeholder="标识" class="ml-4 w-200px" />
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
      <template #bodyCell="{ column, record }: { column: TableColumnType<Menu>, record: Menu }">
        <template v-if="column.dataIndex === 'visible' && record.type === MenuTypeEnum.MENU">
          <ASwitch v-model:checked="record.visible" @change="handleChangeVisible(record)" />
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDate(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a @click="handleOpenEdit(record) ">编辑</a>
            <ADivider type="vertical" />
            <APopconfirm
              :title="`确定要删除${record.title}?`" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a>删除</a>
            </APopconfirm>
          </span>
        </template>
      </template>
    </Table>
  </div>
</template>

<style lang="scss" scoped>
.search-card {
  margin-bottom: 16px;
  background: #fff;
}

.Menu-container {
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
