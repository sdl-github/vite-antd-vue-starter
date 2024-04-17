<script setup lang="ts">
import { queryWarnEventPage } from '~/api/warn'
import type { WarnEvent } from '~/pages/warn/data'

const data = ref<WarnEvent[]>([])
queryData()

async function queryData() {
  const { content } = await queryWarnEventPage({
    pageNo: 1,
    pageSize: 999,
  })
  data.value = content
}
</script>

<template>
  <div class="notice-bar h-60px w-full flex items-center px-4" style="background-color: rgb(253, 246, 236);">
    <span class="notice-bar-text text-xl" style="color:rgb(249, 174, 61)">
      <span v-for="(item, index) in data" :key="index" :class="`mx-4 ${item.level === '危险' && 'text-red'} ${item.level === '警告' && 'text-blue'}`">
        <span>{{ item.name }} </span>
        <span class="ml-2">{{ item.location }} </span>
        <span class="ml-2">{{ item.level }} </span>
      </span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.notice-bar {
  overflow: hidden;
  white-space: nowrap;
}

.notice-bar-text {
  display: inline-block;
  padding-left: 100%;
  animation: notice-bar-slide 20s linear infinite;
}

@keyframes notice-bar-slide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
