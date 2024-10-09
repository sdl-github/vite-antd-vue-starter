<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="tsx">
import { mapEntries } from 'radash'

const loading = ref(false)

// 获取svg文件名
function getSvgName(path: string) {
  const regex = /\/([^/]+)\.svg$/
  const match = path.match(regex)
  if (match) {
    const fileName = match[1]
    return fileName
  }
  return path
}

// 获取所有本地图标
function generateLocalIconList() {
  const localSvgList = import.meta.glob('@/assets/svg-icons/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
  })

  return mapEntries(localSvgList, (key, value) => {
    return [getSvgName(key), value]
  })
}
</script>

<template>
  <div class="relative h-full w-full">
    <ASpin :spinning="loading" tip="加载中...">
      <div class="absolute left-0 right-0 top-0 z-99 rounded">
        <div class="mx-6 mt-4 rounded bg-white p-4">
          <ARow>
            <ACol :span="6">
              <AStatistic title="当前在线用户" :value="1" style="margin-right: 50px" />
            </ACol>
          </ARow>
        </div>
      </div>
    </ASpin>
  </div>
</template>

<style lang="scss"></style>
