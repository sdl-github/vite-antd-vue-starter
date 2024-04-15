<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import useSWRV from 'swrv'
import { message } from 'ant-design-vue'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'
import { createArticleCategory, deleteArticleCategory, queryArticleCategoryTree, updateArticleCategory } from '@/api/article-category'

const rules = {
  name: [{ required: true, message: '必填项' }],
  sort: [{ required: true, message: '必填项' }],
}
const columns = [
  { title: '分类名称', dataIndex: 'name', key: 'name', fixed: true },
  { title: '操作', key: 'action' },
]
const open = ref(false)
const confirmLoading = ref(false)
const form = ref<ModelTypes['ArticleCategory']>({})
const { data, mutate } = useSWRV('queryArticleCategory', () => queryArticleCategoryTree())
const formRef = ref()

function handleOpenCreate(source?: ModelTypes['ArticleCategory']) {
  form.value.id = ''
  form.value.parentId = undefined
  form.value.sort = 0
  if (source)
    form.value.parentId = source.id

  open.value = true
}

async function handleOk() {
  formRef.value.validate().then(async () => {
    confirmLoading.value = true
    const loading = message.loading('加载中', 0)
    try {
      const api = form.value.id ? updateArticleCategory : createArticleCategory
      await api(form.value)
      mutate()
      loading()
      handleClose()
      confirmLoading.value = false
      message.success('成功')
      return true
    }
    catch (e) {
      loading()
      confirmLoading.value = false
      return false
    }
  })
}

function handleClose() {
  form.value.id = ''
  form.value.parentId = undefined
  form.value.sort = 0
  form.value.name = ''
  open.value = false
}

function handleOpenEdit({ name, id, sort }: ModelTypes['ArticleCategory']) {
  form.value.id = id
  form.value.name = name
  form.value.sort = sort
  open.value = true
}

async function handleDelete({ id }: ModelTypes['ArticleCategory']) {
  const loading = message.loading('加载中', 0)
  try {
    await deleteArticleCategory(id!)
    loading()
    mutate()
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
  <div class="p-2">
    <AModal v-model:open="open" :confirm-loading="confirmLoading" :title="form.id ? '编辑分类' : '添加分类'" @cancel="handleClose()" @ok="handleOk">
      <AForm
        ref="formRef"
        class="mt-5"
        :model="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        :rules="rules"
      >
        <AFormItem label="分类名称" name="name">
          <AInput
            v-model:value="form.name"
            placeholder="请输入分类名称"
          />
        </AFormItem>
        <AFormItem label="分类排序" name="sort">
          <AInput
            v-model:value="form.sort"
            placeholder="请输入分类排序"
            type="number"
          />
        </AFormItem>
      </AForm>
    </AModal>
    <div class="min-h-80vh rounded bg-white p-4">
      <div class="mb-4 text-28px">
        分类管理
      </div>

      <AButton type="primary" @click="handleOpenCreate()">
        添加一级分类
      </AButton>
      <div class="mt-4">
        <ATable :row-key="(record: any) => record.id" :columns="columns" :data-source="data" :scroll="{ x: 2000 }" :expand-column-width="100">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <div class="flex items-center">
                <a @click="handleOpenEdit(record)">
                  编辑
                </a>
                <a class="ml-2" @click="handleOpenCreate(record)">
                  新增
                </a>
                <a class="ml-2" @click="handleDelete(record)">
                  删除
                </a>
              </div>
            </template>
          </template>
        </ATable>
      </div>
    </div>
  </div>
</template>
