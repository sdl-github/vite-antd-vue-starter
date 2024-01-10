<route lang="yaml">
  meta:
    layout: dashboard
  </route>

<script setup lang="ts">
import type { TableColumnType, UploadProps } from 'ant-design-vue'
import { Table, Upload, message } from 'ant-design-vue'
import { onMounted, reactive, toRefs } from 'vue'

import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import { columns } from './data'
import type { Point, SearchParam } from './data'
import { deletePoint, queryPointPage, updatePoint } from '~/api/point'
import { DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE } from '@/constants'
import { upload } from '~/api/file'
import { queryAllUserList } from '~/api/user'
import type { ModelTypes } from '~/utils/graphql/zeus'

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
const userOptions = ref<ModelTypes['User'][]>([])
const { search } = toRefs(state)

onMounted(() => {
  initData()
  queryAllUserList().then((res) => {
    userOptions.value = res
  })
})

function generateSearch() {
  const search: SearchParam = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    type: undefined,
    createdAtFrom: '',
    createdAtTo: '',
    nickName: '',
    userId: undefined,
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

const currentId = ref('')

async function customRequest({ file }: UploadRequestOption) {
  const loading = message.loading('加载中', 0)
  try {
    const res = await upload(file as File)
    await updatePoint({ id: currentId.value, fileId: res.id })
    loading()
    initData()
    message.success('成功')
  }
  catch (e) {
    loading()
  }
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const jsJpgOrMp4 = file.type === 'image/jpeg' || file.type === 'video/mp4'
  if (!jsJpgOrMp4)
    message.error(`${file.name} 不是jpg/mp4文件`)
  return jsJpgOrMp4 || Upload.LIST_IGNORE
}
</script>

<template>
  <div class="point-container">
    <ACard>
      <div class="flex">
        <ASelect
          v-model:value="search.userId"
          class="w-200px"
          placeholder="请选择用户"
        >
          <ASelectOption v-for="user in userOptions" :key="user.id" :value="user.id">
            {{ user.nickName || user.userName }}
          </ASelectOption>
        </ASelect>
        <!-- <AInput v-model:value="search.nickName" placeholder="用户姓名" class="w-200px" /> -->
        <ASelect v-model:value="search.type" class="ml-2 w-200px" placeholder="请选择类型">
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
      :data-source="state.data" :loading="state.loading"
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
            <AUpload
              name="file"
              action="/"
              :max-count="1"
              :show-upload-list="false"
              :custom-request="customRequest"
              :before-upload="beforeUpload"
            >
              <AButton
                @click="() => {
                  currentId = record.id!
                }"
              >
                <UploadOutlined />
                上传文件
              </AButton>
            </AUpload>
            <ADivider type="vertical" />
            <APopover placement="top" trigger="click">
              <template #content>
                <div>
                  <div>
                    <div class="flex">
                      <div>用户名:</div>
                      <div class="ml-2">{{ record.user?.userName }}</div>
                    </div>
                    <div class="flex">
                      <div>姓名:</div>
                      <div class="ml-2">{{ record.user?.nickName }}</div>
                    </div>
                    <div class="flex">
                      <div>手机号码:</div>
                      <div class="ml-2">{{ record.user?.phone || "-" }}</div>
                    </div>
                    <div class="flex">
                      <div>x:</div>
                      <div class="ml-2">{{ record.x || "-" }}</div>
                    </div>
                    <div class="flex">
                      <div>y:</div>
                      <div class="ml-2">{{ record.y || "-" }}</div>
                    </div>
                    <div class="flex">
                      <div>z:</div>
                      <div class="ml-2">{{ record.z && (record.z - 600) || "-" }}</div>
                    </div>
                    <div class="flex">
                      <div>呼救信息:</div>
                      <div class="ml-2">{{ '一切正常' }}</div>
                    </div>
                    <div class="flex">
                      <div>监控时间:</div>
                      <div class="ml-2">{{ formatDate(record.createdAt) }}</div>
                    </div>
                  </div>
                  <div>
                    媒体信息
                    <div v-if="record.file?.mimeType === 'image/jpeg'">
                      <AImage
                        :width="200"
                        :src="record.file.url"
                      />
                    </div>
                    <div v-if="record.file?.mimeType === 'video/mp4'">
                      <video controls width="200">
                        <source :src="record.file?.url" type="video/mp4">
                      </video>
                    </div>
                  </div>
                </div>
              </template>
              <template #title>
                <span>{{ record.user?.nickName }}</span>
              </template>
              <AButton>
                预览点信息
              </AButton>
            </APopover>
            <ADivider type="vertical" />
            <APopconfirm :title="`确定要删除${record.id}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id!)">
              <a class="text-red">删除</a>
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
  height: 100%;
  padding: 10px;
  overflow: hidden;
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
