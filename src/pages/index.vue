<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="tsx">
const loading = ref(false)
</script>

<template>
  <div class="relative h-full w-full">
    <ASpin :spinning="loading" tip="加载中...">
      <div class="absolute left-0 right-0 top-0 z-99 rounded">
        <div class="mx-6 mt-4 rounded bg-white p-4">
          <ARow>
            <ACol :span="6">
              欢迎使用
            </ACol>
          </ARow>
        </div>
      </div>
    </ASpin>
  </div>
</template>

<style lang="scss"></style>
