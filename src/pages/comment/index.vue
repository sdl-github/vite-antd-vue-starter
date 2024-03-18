<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="ts">
import type { SorterResult } from 'ant-design-vue/es/table/interface'
import { type TableColumnType, message } from 'ant-design-vue'
import { columns, generateSearch } from './data'
import type { Comment, State } from './data'
import { deleteComment, queryCommentPage, replyComment } from '~/api/comment'

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
  const res = await queryCommentPage(search)
  const { content, totalElements } = res.queryCommentPage!
  state.data = content as Comment[]
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

async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await deleteComment(id)
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

async function handleReply(item: any) {
  const loading = message.loading('加载中', 0)
  try {
    await replyComment({
      id: item.id,
      reply: item.reply,
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
    <!-- 搜索 -->
    <ACard>
      <div class="flex">
        <AInput v-model:value="search.content" placeholder="意见内容" class="w-200px" />
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
      <template #bodyCell="{ column, record }: { column: TableColumnType<Comment>, record: Comment }">
        <template v-if="column.dataIndex === 'org'">
          <span>
            {{ record.org?.name }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'content'">
          <div v-html="record?.content" />
        </template>
        <template v-if="column.dataIndex === 'user'">
          <span>
            {{ record.user?.nickName || record.user?.userName }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'replyUser'">
          <span>
            {{ record.replyUser?.nickName || record.replyUser?.userName }}
          </span>
        </template>

        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDate(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'replyAt'">
          <span>
            {{ formatDate(record.replyAt) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <span>
            {{ record.replyAt ? '已回复' : '未回复' }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <APopconfirm
              :title="`确定要删除${record.id}?`" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a>删除</a>
            </APopconfirm>
            <ADivider type="vertical" />
            <APopconfirm ok-text="确定" cancel-text="取消" @confirm="handleReply(record)" @cancel="record.reply = ''">
              <template #icon />
              <template #title>
                <ATextarea
                  v-model:value="record.reply"
                  placeholder="请输入"
                  :auto-size="{ minRows: 2, maxRows: 5 }"
                />
              </template>
              <a>回复</a>
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
