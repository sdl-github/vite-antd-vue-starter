<route lang="yaml">
meta:
  layout: dashboard
  offAuth: true
</route>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import type { File, SearchParam } from './data'
import { columns } from './data'
import FileUploadModal from './components/FileUploadModal.vue'
import { deleteFileById, queryFilePage } from '@/api/file'

interface State {
  loading: boolean
  modalVisible: boolean
  data: File[]
  currentItem: File | null
  search: SearchParam
  total: number
}

const uploadLoading = ref(false)

const state = reactive<State>({
  loading: false,
  modalVisible: false,
  data: [],
  currentItem: {},
  total: 0,
  search: generateSearch(),
})

const { search } = toRefs(state)

onMounted(() => {
  initData()
})

function generateSearch() {
  const search: SearchParam = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    fileName: '',
    originName: '',
    provider: undefined,
  }
  return search
}

// 初始化数据
async function initData() {
  state.loading = true
  const { search } = state
  const res = await queryFilePage(search)
  const { content, totalElements } = res.queryFilePage!
  state.total = totalElements as number
  state.data = content as File[]
  state.loading = false
}

function formatBytes(value: string | number) {
  if (value == null || value === '')
    return '0 Bytes'

  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let index = 0
  const srcsize = Number.parseFloat(String(value))
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  let size: number | string = srcsize / 1024 ** index
  size = size.toFixed(2)
  return size + unitArr[index]
}

function customRequest(options: any) {
  uploadLoading.value = true
  const { file } = options
  // uploadSinlgeFile(file).then((res) => {
  //   const msg = '上传成功'
  //   initData()
  //   message.success(msg)
  // }).catch((e) => {
  //   message.error('上传出错了')
  // }).finally(() => {
  //   uploadLoading.value = false
  // })
}

function beforeUpload(file: any) {
  const limit = 1024 * 1024 * 10
  if (file.size > limit) {
    message.info(`上传文件大小不能超过${formatBytes(limit)}`)
    return false
  }
  return true
}

// 搜索回调
function handleSearch() {
  handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE)
}

// 分页回调
function handleShowSizeChange(current: number, pageSize: number) {
  search.value.pageNo = current
  search.value.pageSize = pageSize
  initData()
}

function handleReset() {
  state.search = generateSearch()
  handleShowSizeChange(DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE)
}

// 删除请求
async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await deleteFileById(id)
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

function handleOpenUploadDrawer() {
  state.modalVisible = true
}
</script>

<template>
  <div class="user-container">
    <FileUploadModal v-model:open="state.modalVisible" @ok="initData" />
    <ACard>
      <div class="flex">
        <AInput v-model:value="search.fileName" placeholder="文件名" class="w-200px" />
        <AInput v-model:value="search.originName" placeholder="原始文件名" class="ml-4 w-200px" />
        <AInput v-model:value="search.provider" placeholder="存储提供服务方" class="ml-4 w-200px" />
        <div class="ml-2 flex items-center">
          <AButton
            :loading="state.loading" class="flex items-center justify-center" type="primary"
            @click="handleSearch"
          >
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
      <AButton :loading="uploadLoading" class="flex items-center" type="primary" @click="handleOpenUploadDrawer">
        <div class="i-ri-upload-cloud-line" />
        <div class="ml-2">
          上传
        </div>
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
    <ATable
      :pagination="false" :scroll="{ x: 1500 }" :columns="columns" :row-key="(record: any) => record.id"
      :data-source="state.data" :loading="state.loading"
    >
      <template #bodyCell="{ column, record }: { column: TableColumnType<File>, record: File }">
        <template v-if=" column.dataIndex === 'size' ">
          <span>
            {{ formatBytes(record.fileSize || '') }}
          </span>
        </template>
        <template v-if=" column.dataIndex === 'createdAt' ">
          <span v-time>
            {{ record.createdAt }}
          </span>
        </template>
        <template v-if=" column.key === 'operation' ">
          <span>
            <APopconfirm
              :title=" `确定要删除${record.fileName}?` " ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a>删除</a>
            </APopconfirm>
          </span>
        </template>
      </template>
    </ATable>
    <div class="pagination-card">
      <APagination
        v-model:current=" search.pageNo " v-model:pageSize=" search.pageSize " show-size-changer
        :total=" state.total " :show-total=" () => `共 ${state.total} 条` " @change=" handleShowSizeChange "
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
