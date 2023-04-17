<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

<script setup lang="ts">
import { computed } from 'vue'

const userStore = useUserStore()
const user = computed(() => userStore.user)
</script>

<template>
  <div class="">
    <div class="w-[100%] h-[220px] rounded flex items-center justify-center flex-col p-5 bg-[#f0f9ff]">
      <a-avatar style="background-color: #1890ff" :size="60" :src="user?.avatar">
        {{ user?.username }}
      </a-avatar>
      <span class="my-4 font-bold rounded text-sm px-2 py-1 bg-purple-200 text-purple-500">{{ user?.nickname }}</span>
    </div>
  </div>
</template>
