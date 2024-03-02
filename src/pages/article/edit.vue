<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import { Article } from './data';

const router = useRouter()
const form = reactive<Article>({
  html: ""
})
</script>

<template>
  <div class="w-full p-2">
    <div class="rounded bg-white">
      <APageHeader class="px-4 py-2" title="返回" sub-title="新建/编辑文章" @back="() => router.push('/article')">
        <template #extra>
          <a-button key="1">保存草稿</a-button>
          <a-button key="1" type="primary">发布</a-button>
        </template>
      </APageHeader>
    </div>

    <div class="mt-2 rounded bg-white p-2">
      <div class="mt-4">
        <HaloRichtextEditor v-model:content="form.html" />
      </div>
    </div>
  </div>
</template>
