<route lang="yaml">
  meta:
    layout: dashboard
  </route>

<script setup lang="ts">
import type { TableColumnType, UploadProps } from 'ant-design-vue'
import { Table, Upload, message } from 'ant-design-vue'
import { onMounted, reactive, toRefs } from 'vue'

import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import dayjs from 'dayjs'
import FromModal from './FormModal.vue'
import { columns } from './data'
import type { SearchParam, WarnEvent } from './data'

// import { deleteWarnEvent, queryWarnEventPage, updateWarnEvent } from '~/api/WarnEvent'
import { DEFAULT_PAGE_NO, DEFAULT_PAGE_SIZE } from '@/constants'
import { upload } from '~/api/file'
import type { ModelTypes } from '~/utils/graphql/zeus'
import { deleteWarnEvent, queryWarnEventPage } from '~/api/warn'

interface State {
  loading: boolean
  modalVisible: boolean
  data: WarnEvent[]
  currentItem: WarnEvent | null
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
    createdAtFrom: '',
    createdAtTo: '',
    level: '',
    title: '',
  }
  return search
}

// 初始化数据
async function initData() {
  state.loading = true
  const { search } = state
  const { content, totalElements } = await queryWarnEventPage(search)
  state.data = content as WarnEvent[]
  state.total = totalElements as number
  state.loading = false
}

// 删除请求
async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await deleteWarnEvent(id)
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

function handleOpenCreate() {
  state.modalVisible = true
}
</script>

<template>
  <div class="WarnEvent-container">
    <FromModal v-model:open="state.modalVisible" :current-item="state.currentItem" @ok="initData" />
    <ACard>
      <div class="flex">
        <AInput v-model:value="search.level" placeholder="等级" class="w-200px" />
        <AInput v-model:value="search.title" placeholder="内容" class="ml-2 w-200px" />
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
      <AButton v-if="checkPermission(['NEW_WARN_BTN'])" type="primary" @click="handleOpenCreate">
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
      :data-source="state.data" :loading="state.loading"
    >
      <template #bodyCell="{ column, record }: { column: TableColumnType<WarnEvent>, record: WarnEvent }">
        <template v-if="column.dataIndex === 'warnTime'">
          <span>
            {{ formatDate(record.warnTime) }}
          </span>
        </template>
        <template v-if="column.key === 'operation'">
          <span>
            <AButton
              v-if="checkPermission(['EDIT_WARN_BTN'])"
              @click="() => {
                state.currentItem = record
                state.modalVisible = true
              }"
            >
              编辑
            </AButton>
            <ADivider type="vertical" />
            <APopover placement="top" trigger="click">
              <template #content>
                <div>
                  媒体信息
                  <div v-if="!record.fileUrl">暂无</div>
                  <div v-else>
                    <div v-if="['jpg', 'jpeg'].includes(record.fileUrl.match(/\.([^.]+)$/)[1])">
                      <AImage
                        :width="200"
                        :src="record.fileUrl"
                      />
                    </div>
                    <div v-if="record.fileUrl.match(/\.([^.]+)$/)[1] === 'mp4'">
                      <video controls width="200">
                        <source :src="record.fileUrl" type="video/mp4">
                      </video>
                    </div>
                  </div>
                </div>
              </template>
              <AButton>
                预览资源
              </AButton>
            </APopover>
            <ADivider type="vertical" />
            <APopconfirm v-if="checkPermission(['DEL_WARN_BTN'])" :title="`确定要删除${record.id}?`" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record.id!)">
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

.WarnEvent-container {
  width: 100%;
  height: 100%;
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
