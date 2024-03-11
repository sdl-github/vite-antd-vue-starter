<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import type { SorterResult } from 'ant-design-vue/es/table/interface'
import { type TableColumnType, message } from 'ant-design-vue'
import { OrgType, columns, generateSearch } from './data'
import type { Org, State } from './data'
import OrgModal from './components/OrgModal.vue'
import { deleteOrg, queryOrgPage } from '~/api/org'

const state: State = reactive({
  loading: false,
  modalVisible: false,
  currentItem: null,
  data: [],
  search: generateSearch(),
  total: 0,
})

const { search } = toRefs(state)

initData()
// 初始化数据
async function initData() {
  state.loading = true
  const { search } = state
  const res = await queryOrgPage(search)
  const { content, totalElements } = res.queryOrgPage!
  state.data = content as Org[]
  state.total = totalElements as number
  state.loading = false
}
// 分页回调
function handleShowSizeChange(current: number, pageSize: number) {
  search.value.pageNo = current
  search.value.pageSize = pageSize
  initData()
}

// 搜索回调
function handleSearch() {
  handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE)
}

function handleReset() {
  state.search = generateSearch()
  handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE)
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

function handleOpenCreate() {
  state.modalVisible = true
}

function handleOpenEdit(record: Org) {
  state.modalVisible = true
  state.currentItem = record
}

async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await deleteOrg(id)
    initData()
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
  <div class="w-full">
    <OrgModal v-model:open="state.modalVisible" :current-item="state.currentItem" @ok="initData" @cancel="() => state.currentItem = null" />
    <!-- 搜索 -->
    <ACard>
      <div class="flex">
        <AInput v-model:value="search.name" placeholder="名称" class="w-200px" />
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
    <!-- 刷新 -->
    <div class="h-64px flex justify-end py-16px">
      <AButton type="primary" @click="handleOpenCreate">
        新建
      </AButton>
      <div class="mx-16px flex items-center">
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
    <!-- 表格 -->
    <ATable
      :pagination="false" :columns="columns" :row-key="(record: any) => record.id" :data-source="state.data"
      :loading="state.loading" @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }: { column: TableColumnType<Org>, record: Org }">
        <template v-if="column.dataIndex === 'logo'">
          <AImage
            :width="100"
            :src="record.logo"
          />
        </template>
        <template v-if="column.dataIndex === 'orgType'">
          <span>
            {{ OrgType[record.orgType!] }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'head'">
          <span>
            {{ record.lead?.nickName || record.lead?.userName }}
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

            <APopconfirm
              :title="`确定要删除${record.name}?`" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a>删除</a>
            </APopconfirm>
          </span>
        </template>
      </template>
    </ATable>
    <!-- 分页 -->
    <div class="my-10px h-60px w-full flex items-center justify-end bg-white px-20px">
      <APagination
        v-model:pageSize="search.pageSize" :current="search.pageNo" show-size-changer :total="state.total"
        :show-total="() => `共 ${state.total} 条`" @change="handleShowSizeChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
