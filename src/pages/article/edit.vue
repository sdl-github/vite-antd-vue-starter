<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import type { FormModel } from './data'
import { generateFormModel } from './data'
import { createArticle, queryArticle, updateArticle } from '~/api/article'
import { useModal } from '~/components/ArticlePublishModal.vue'

const route = useRoute()
const loading = ref(true)
const saveLoading = ref(false)
const router = useRouter()
const state = reactive<{ form: FormModel }>({
  form: generateFormModel(),
})

const { form } = toRefs(state)

const articlePublishModal = useModal()

watchEffect(() => {
  const id = route.query.id
  if (id) {
    initData(id as string)
    return
  }
  loading.value = false
})

async function initData(id: string) {
  loading.value = true
  const { queryArticle: res } = await queryArticle(id)
  const { title, html, markdown, metaDescription, metaTitle, image, categoryId } = res as FormModel
  state.form = {
    id,
    title,
    html,
    markdown,
    metaDescription,
    metaTitle,
    image,
    categoryId,
  }
  loading.value = false
}

async function handleSave() {
  saveLoading.value = true
  const loading = message.loading('加载中', 0)
  try {
    const data = unref(form)

    const api = data.id ? updateArticle : createArticle

    if (!data.id)
      delete (data as any).id

    const res = await api(data)
    if ('createArticle' in res)
      state.form.id = res.createArticle!.id as string

    loading()
    saveLoading.value = false
    message.success('成功')
    return true
  }
  catch (e) {
    loading()
    saveLoading.value = false
    return false
  }
}

async function handlePublish() {
  articlePublishModal.open(unref(form))
}
</script>

<template>
  <div class="w-full p-2">
    <ArticlePublishModal />

    <div class="sticky top-0 z-999 rounded bg-white shadow">
      <APageHeader class="px-4 py-2" sub-title="新建/编辑文章" @back="() => router.push('/article')">
        <template #title>
          <div class="cursor-pointer" @click="router.push('/article')">
            返回
          </div>
        </template>
        <template #extra>
          <AButton :loading="saveLoading" @click="handleSave">
            保存
          </AButton>
          <AButton type="primary" @click="handlePublish">
            发布
          </AButton>
        </template>
      </APageHeader>
    </div>

    <div class="m-auto mt-2 min-h-80vh w-768px rounded bg-white p-2">
      <div v-if="loading" class="h-100vh flex justify-center pt-10">
        <div class="flex flex-col items-center">
          <ASpin />
          <div>加载中</div>
        </div>
      </div>
      <div v-else class="w-full px-10 py-8">
        <TextbusEditor v-model:content="form.html" />
      </div>
    </div>
  </div>
</template>
