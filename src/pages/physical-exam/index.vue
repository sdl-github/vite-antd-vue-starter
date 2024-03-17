<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="ts">
import type { SorterResult } from 'ant-design-vue/es/table/interface'
import { type TableColumnType, message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { columns, generateSearch } from './data'
import type { PhysicalExam, State } from './data'
import PhysicalExamModal from './components/PhysicalExamModal.vue'
import { deletePhysicalExam, queryPhysicalExamPage, setWarn } from '~/api/physical-exam'

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
  const res = await queryPhysicalExamPage(search)
  const { content, totalElements } = res!
  state.data = (content as PhysicalExam[]).map((item) => {
    // 设置一个日期，例如半年前
    const halfYearAgo = dayjs().subtract(6, 'months')
    // 判断当前日期是否在半年以上
    const onDate = dayjs(item.user?.lastExamData).diff(halfYearAgo, 'day') > 0
    return { ...item, onDate }
  })
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

async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await deletePhysicalExam(id)
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

async function handleSetWarn(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await setWarn({
      id,
      warn: true,
    })
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
    <PhysicalExamModal v-model:open="state.modalVisible" :current-item="state.currentItem" @ok="initData" @cancel="() => state.currentItem = null" />
    <!-- 搜索 -->
    <ACard>
      <div class="flex">
        <AInput v-model:value="search.orgName" placeholder="机构名称" class="w-200px" />
        <AInput v-model:value="search.userName" placeholder="姓名" class="ml-2 w-200px" />
        <ADatePicker v-model:value="search.date" placeholder="日期" class="ml-2" />
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
      <template #bodyCell="{ column, record }: { column: TableColumnType<PhysicalExam>, record: PhysicalExam }">
        <template v-if="column.dataIndex === 'org'">
          <span>
            {{ record.org?.name }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'warn'">
          <span :class="`${record.warn ? 'text-green' : 'text-red'}`">
            {{ record.warn && '已提醒' || '未提醒' }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'user'">
          <span>
            {{ record.user?.nickName || record.user?.userName }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'date'">
          <span>
            {{ formatDateNoMin(record.date) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'onDate'">
          <span :class="`${record.onDate ? 'text-green' : 'text-red'}`">
            {{ record.onDate && "是" || "否" }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDateNoMin(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'lastDate'">
          <span>
            {{ formatDateNoMin(record.user?.lastExamData) }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <APopconfirm
              :title="`确定要删除${record.user?.nickName}-${formatDateNoMin(record.date)}?`" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a>删除</a>
            </APopconfirm>
            <ADivider type="vertical" />
            <a class="text-green" @click="handleSetWarn(record.id!)">电话提醒</a>
            <ADivider type="vertical" />
            <a class="text-pink" @click="handleSetWarn(record.id!)">短信提醒</a>
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
