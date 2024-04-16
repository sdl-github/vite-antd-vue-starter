<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="ts">
import { type TableColumnType, message } from 'ant-design-vue'
import { columns } from './data'
import type { Banner, State } from './data'
import BannerModal from './components/BannerModal.vue'
import { deleteBanner, queryAllBannerList } from '~/api/banner'

const state: State = reactive({
  loading: false,
  modalVisible: false,
  currentItem: null,
  data: [],
  total: 0,
})

initData()

function handleOpenCreate() {
  state.modalVisible = true
}
// 初始化数据
async function initData() {
  state.loading = true
  const res = await queryAllBannerList()
  state.data = res as any as Banner[]
  state.loading = false
}

async function handleDelete(id: string) {
  const loading = message.loading('加载中', 0)
  try {
    await deleteBanner(id)
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
    <BannerModal v-model:open="state.modalVisible" :current-item="state.currentItem" @ok="initData" />
    <!-- 搜索 -->
    <ACard>
      <div class="flex">
        <div class="ml-2 flex items-center">
          <AButton :loading="state.loading" class="flex items-center justify-center" type="primary" @click="initData">
            <template #icon>
              <div class="i-ri-search-line mr-2" />
            </template>
            <div>
              查询
            </div>
          </AButton>
        </div>
      </div>
    </ACard>
    <!-- 刷新 -->
    <div class="h-64px flex justify-end py-16px">
      <div class="mx-16px flex items-center">
        <AButton type="primary" @click="handleOpenCreate">
          新建
        </AButton>
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
      :loading="state.loading"
    >
      <template #bodyCell="{ column, record }: { column: TableColumnType<Banner>, record: Banner }">
        <template v-if="column.dataIndex === 'url'">
          <AImage :src="record.url" :width="200" />
        </template>

        <template v-if="column.key === 'operation'">
          <span>
            <APopconfirm
              title="确定要删除?" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(record.id!)"
            >
              <a>删除</a>
            </APopconfirm>
            <ADivider type="vertical" />
          </span>
        </template>
      </template>
    </ATable>
  </div>
</template>

<style lang="scss" scoped>

</style>
