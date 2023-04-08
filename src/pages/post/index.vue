<route lang="yaml">
meta:
  layout: PostLayout
</route>

<script setup lang="ts">
import type { ModelTypes } from '@/utils/graphql/zeus'
import { queryPostPage } from '@/api/post'
const router = useRouter()
type Post = ModelTypes['Post']
const list = ref<Post[]>()
onMounted(async () => {
  queryList()
})
async function queryList() {
  const res = await queryPostPage()
  if (res && res.queryPostPage?.data) {
    list.value = res.queryPostPage.data as Post[]
  }
}

function handleClickPost(item: Post) {
  const id = item.id
  router.push({
    path: `/post/${id}`,
  })
}
</script>

<template>
  <div class="min-h-100vh flex justify-center">
    <template v-if="!list">
      <div class="bg-#fff rounded p-5 w-720px my-2">
        <a-skeleton active />
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col m-2">
        <PostItem v-for="item in list" :key="item.id" :post="item" @click="handleClickPost(item)" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
