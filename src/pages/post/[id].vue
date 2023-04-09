<route lang="yaml">
meta:
  layout: PostLayout
</route>

<script setup lang="ts">
import { Viewer } from '@bytemd/vue-next'
import gemoji from '@bytemd/plugin-gemoji'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import gfm from '@bytemd/plugin-gfm'
import { queryPost } from '@/api/post'

import type { ModelTypes } from '@/utils/graphql/zeus'
import '@/components/md-editor/theme/smart-blue.css'
import copyCode from '@/components/md-editor/plugins/copy-code/index'
type Post = ModelTypes['Post']

const plugins = [
  gemoji(),
  breaks(),
  frontmatter(),
  gfm(),
  copyCode(),
]
const route = useRoute()
const id = computed(() => route.params.id)
const post = ref<Post>()
watchEffect(async () => {
  if (id.value) {
    const res = await queryPost({ postId: id.value as string })
    post.value = res.queryPost as Post
    document.title = res.queryPost.title
  }
})
</script>

<template>
  <div class="flex justify-center pt-5">
    <template v-if="!post">
      <div class="bg-#fff rounded p-5 w-720px my-2 min-h-100vh">
        <a-skeleton active />
      </div>
    </template>
    <template v-else>
      <div class="bg-#fff rounded p-5 w-720px my-2 min-h-100vh">
        <h1 class="color-#252933 text-1.5rem text-[600px] mb-2">
          {{ post.title }}
        </h1>
        <div class="h-35px flex mt-10 mb-4">
          <div class="h-full w-50px">
            <a-avatar :size="35" :src="post.user.avatar" />
          </div>
          <div class="ml-1 flex flex-col h-full justify-between">
            <div class="color-[#515767] font-bold">
              {{ post.user.nickname || post.user.username }}
            </div>
            <div v-time class="color-[#8a919f]">
              {{ post.createdAt }}
            </div>
          </div>
        </div>
        <Viewer :plugins="plugins" :value="post.currentContent" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
