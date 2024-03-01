<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="w-full p-2">
    <div class="rounded bg-white">
      <APageHeader
        style="border-bottom: 1px solid rgb(235, 237, 240)"
        title="返回"
        sub-title="新建/编辑文章"
        @back="() => router.push('/article')"
      />
    </div>

    <div class="mt-2 rounded bg-white p-2">
      <div>
        <AInput placeholder="标题" />
      </div>
      <div class="mt-4">
        <TinyMceEditor />
      </div>
    </div>
  </div>
</template>
