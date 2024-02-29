<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import useSWRV from 'swrv'
import { message } from 'ant-design-vue'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'
import { createArticleCategory, queryArticleCategoryTree, updateArticleCategory } from '@/api/article-category'

const rules = {
  name: [{ required: true, message: '必填项' }],
  sort: [{ required: true, message: '必填项' }],
}
const open = ref(false)
const confirmLoading = ref(false)
const form = ref<ModelTypes['ArticleCategory']>({})
const { data, mutate } = useSWRV('queryArticleCategory', () => queryArticleCategoryTree())
const formRef = ref()

function addCategory() { }

function handleOpenCreate() {
  form.value.id = ''
  form.value.sort = 0
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

      <AButton type="primary" @click="handleOpenCreate">
        添加一级分类
      </AButton>
      <div class="mt-4">
        <ATree
          :tree-data="data as any"
          :field-names="{
            children: 'children',
            title: 'name',
            key: 'id',
          }"
        >
          <template #title="item">
            <div class="min-w-200px flex items-center justify-between px-2">
              <div>{{ item.name }}</div>
              <div class="flex items-center">
                <div @click="handleOpenEdit(item)">
                  编辑
                </div>
                <div class="ml-2">
                  新增
                </div>
              </div>
            </div>
          </template>
        </ATree>
      </div>
    </div>
  </div>
</template>
