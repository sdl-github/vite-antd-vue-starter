<script setup lang="ts">
import { message } from 'ant-design-vue'
import useSWRV from 'swrv'
import { queryArticle } from '~/api/article'
import type { ModelTypes } from '@/utils/graphql/zeus'
import { createComment } from '~/api/comment'

const route = useRoute()
const id = route.params.id
const comment = ref('')
const { data } = useSWRV(id && `queryArticle/${id}` || null, () => queryArticle(id as string))
const loading = computed(() => !data.value)
const actLoading = ref(false)

function handleSendComment() {
  if (!comment.value) {
    message.warning('评论不能为空')
    return
  }
  actLoading.value = true
  const input: ModelTypes['CreateCommentInput'] = {
    content: comment.value,
    relationId: id as string,
  }
  createComment(input).then(() => {
    message.success('评论成功')
    actLoading.value = false
  }).catch(() => {
    actLoading.value = false
  })
}
</script>

<template>
  <div class="flex">
    <div class="px-6 py-10">
      <ATextarea v-model:value="comment" />
      <AButton :loading="actLoading" class="mt-4" @click="handleSendComment">
        发送评论
      </AButton>
    </div>
    <div class="mx-auto w-xl overflow-clip">
      <h1 class="my-10 text-xl font-bold">
        {{ data?.queryArticle?.title }}
      </h1>
      <div class="mt-2" v-html="data?.queryArticle?.html" />
    </div>
  </div>
</template>
