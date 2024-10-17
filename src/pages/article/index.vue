<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import type { SorterResult } from 'ant-design-vue/es/table/interface'
import { type TableColumnType, message } from 'ant-design-vue'
import { ArticleStatus, columns, generateSearch } from './data'
import type { Article, State } from './data'
import { delArticle, queryArticlePage, unpublishArticle } from '~/api/article'
import { ArticleStatusEnum } from '~/utils/graphql/zeus'

const state: State = reactive({
  loading: false,
  modalVisible: false,
  currentItem: null,
  data: [],
  search: generateSearch(),
  total: 0,
})
const router = useRouter()
const { search } = toRefs(state)

initData()
// 初始化数据
async function initData() {
  state.loading = true
  const { search } = state
  const res = await queryArticlePage(search)
  const { content, totalElements } = res.queryArticlePage!
  state.data = content as Article[]
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
  router.push('/article/edit')
}

function handleOpenEdit(record: Article) {
  router.push(`/article/edit?id=${record.id}`)
}

async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await delArticle(id)
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

async function handleUnpublish(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await unpublishArticle(id)
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
</script>

<template>
  <div class="w-full">
    <!-- 搜索 -->
    <ACard>
      <div class="flex">
        <AInput v-model:value="search.title" placeholder="标题" class="w-200px" />
        <ArticleCategorySelect v-model:value="search.categoryId" class="ml-2 w-200px" />
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
      <template #bodyCell="{ column, record }: { column: TableColumnType<Article>, record: Article }">
        <template v-if="column.dataIndex === 'category'">
          {{ record.category?.name }}
        </template>
        <template v-if="column.dataIndex === 'status'">
          <ABadge :status="ArticleStatusEnum.DRAFT === record.status ? 'warning' : 'success'" />
          <span>
            {{ ArticleStatus[record.status!] }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span>
            {{ formatDate(record.createdAt) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'publishedAt'">
          <span>
            {{ formatDate(record.publishedAt) }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a @click="handleOpenEdit(record)">编辑</a>
            <ADivider type="vertical" />
            <template v-if="record.status === ArticleStatusEnum.PUBLISHED">
              <APopconfirm
                :title="`确定要下架${record.title}?`" ok-text="确定" cancel-text="取消"
                @confirm="handleUnpublish(record.id!)"
              >
                <a>下架</a>
              </APopconfirm>
              <ADivider type="vertical" />
              <a target="_blank" :href="`/#/article/${record.id}`">预览</a>
            </template>
            <template v-if="record.status === ArticleStatusEnum.DRAFT">
              <APopconfirm
                :title="`确定要删除${record.title}?`" ok-text="确定" cancel-text="取消"
                @confirm="handleDelete(record.id!)"
              >
                <a>删除</a>
              </APopconfirm>
            </template>
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
