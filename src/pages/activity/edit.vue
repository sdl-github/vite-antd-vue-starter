<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import type { FormModel } from './data'
import { generateFormModel } from './data'
import { createActivity, queryActivity, updateActivity } from '~/api/activity'
import { useModal } from '~/components/ActivityPublishModal.vue'

const route = useRoute()
const loading = ref(true)
const saveLoading = ref(false)
const router = useRouter()
const state = reactive<{ form: FormModel }>({
  form: generateFormModel(),
})

const { form } = toRefs(state)

const activityPublishModal = useModal()

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
  const { queryActivity: res } = await queryActivity(id)
  const { title, html, markdown, metaDescription, metaTitle, image } = res as FormModel
  state.form = {
    id,
    title,
    html,
    markdown,
    metaDescription,
    metaTitle,
    image,
  }
  loading.value = false
}

async function handleSave() {
  saveLoading.value = true
  const loading = message.loading('加载中', 0)
  try {
    const data = unref(form)

    const api = data.id ? updateActivity : createActivity

    if (!data.id)
      delete data.id

    const res = await api(data)
    if ('createActivity' in res)
      state.form.id = res.createActivity?.id

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
  activityPublishModal.open(unref(form))
}
</script>

<template>
  <div class="w-full p-2">
    <ActivityPublishModal />

    <div class="rounded bg-white">
      <APageHeader class="px-4 py-2" sub-title="新建/编辑活动" @back="() => router.push('/activity')">
        <template #title>
          <div class="cursor-pointer">
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

    <div class="mt-2 min-h-40vh rounded bg-white p-2">
      <div v-if="loading" class="h-100vh flex justify-center pt-10">
        <div class="flex flex-col items-center">
          <ASpin />
          <div>加载中</div>
        </div>
      </div>
      <div v-else class="">
        <HaloRichtextEditor v-model:content="form.html" />
      </div>
    </div>
  </div>
</template>
