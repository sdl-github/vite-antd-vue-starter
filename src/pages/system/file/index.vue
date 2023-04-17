<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import TableSearchCard from './components/TableSearchCard.vue'
import type { IFile, IState } from './type'
import { delFile, queryFilePage, uploadSinlgeFile } from '@/api/file'

const uploadLoading = ref(false)
const state = reactive<IState>({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  dataList: [],
  loading: false,
  modalVisible: false,
  currentItem: {
    id: '',
    originalName: '',
    hash: '',
    size: 0,
  },
  searchParams: {
    fileName: '',
    originalName: '',
    from: '',
    to: '',
  },
})

const columns: TableColumnType<IFile>[] = [
  {
    title: '图片',
    align: 'center',
    width: 180,
    dataIndex: 'url',
  },
  {
    title: '文件名',
    align: 'center',
    width: 180,
    dataIndex: 'fileName',
  },
  {
    title: '原始文件名',
    align: 'center',
    width: 180,
    dataIndex: 'originalName',
  },
  {
    title: '文件类型',
    align: 'center',
    width: 180,
    dataIndex: 'mimeType',
  },
  {
    title: '文件大小',
    align: 'center',
    width: 180,
    dataIndex: 'size',
  },
  {
    title: '创建时间',
    align: 'center',
    width: 180,
    dataIndex: 'createdAt',
  },
  {
    title: '创建人',
    align: 'center',
    width: 180,
    dataIndex: 'createdBy',
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
  const { pageNo, pageSize, searchParams } = state
  const {
    queryFilePage: { data, totalCount },
  } = await queryFilePage({
    pageNo,
    pageSize,
    ...searchParams,
  })
  state.total = totalCount
  state.dataList = data as IFile[]
  state.loading = false
}

// 格式化内容
function formatValue(value?: string) {
  return value || '--'
}

function formatBytes(value: string | number) {
  if (value == null || value === '') {
    return '0 Bytes'
  }
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let index = 0
  const srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  let size = srcsize / 1024 ** index
  size = size.toFixed(2)
  return size + unitArr[index]
}

function customRequest(options: any) {
  uploadLoading.value = true
  const { file } = options
  uploadSinlgeFile(file).then((res) => {
    let msg = '上传成功'
    if (res.exist) {
      msg = `文件已存在：${res.originalName}`
    }
    initData()
    message.success(msg)
  }).catch((e) => {
    message.error('上传出错了')
  }).finally(() => {
    uploadLoading.value = false
  })
}

function beforeUpload(file: File) {
  const limit = 1024 * 1024 * 10
  if (file.size > limit) {
    message.info(`上传文件大小不能超过${formatBytes(limit)}`)
    return false
  }
  return true
}
// 搜索回调
function handleSearch(v: any) {
  state.searchParams = v
  state.pageNo = 1
  state.pageSize = 10
  initData()
}
// 分页回调
function handleShowSizeChange(current: number, pageSize: number) {
  state.pageNo = current
  state.pageSize = pageSize
  initData()
}

// 删除请求
async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await delFile(id)
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
  <div class="user-container">
    <TableSearchCard @handle-search="handleSearch" />
    <div class="table-header">
      <a-upload
        name="file"
        action=""
        :show-upload-list="false"
        :custom-request="customRequest"
        :before-upload="beforeUpload"
      >
        <a-button :loading="uploadLoading" class="flex items-center" type="primary">
          <div class="i-ri-upload-cloud-line " />
          <div class="ml-2">
            上传
          </div>
        </a-button>
      </a-upload>

      <div class="table-action">
        <a-tooltip placement="top">
          <template #title>
            <span>刷新</span>
          </template>
          <a-button class="flex items-center justify-center" type="text" shape="circle" @click="initData">
            <div class="i-ri-refresh-line" />
          </a-button>
        </a-tooltip>
      </div>
    </div>
    <a-table
      :pagination="false" :scroll="{ x: 1500 }" :columns="columns" :row-key="(record: any) => record.id"
      :data-source="state.dataList" :loading="state.loading"
    >
      <template #bodyCell="{ column, record }: { column: TableColumnType<IFile>, record: IFile }">
        <template v-if="column.dataIndex === 'url'">
          {{ record.url }}
        </template>
        <template v-if="column.dataIndex === 'size'">
          <span>
            {{ formatBytes(record.size) }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          <span v-time>
            {{ record.createdAt }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <a-popconfirm
              :title="`确定要删除${record.originalName}?`" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>
    <div class="pagination-card">
      <a-pagination
        v-model:current="state.pageNo" v-model:pageSize="state.pageSize" show-size-changer
        :total="state.total" :show-total="() => `共 ${state.total} 条`" @change="handleShowSizeChange"
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
