<script setup lang="ts">
import { computed } from 'vue'
import { userStore } from '@/stores/user'

const userState = userStore()
const userInfo = computed(() => userState.userInfo)
</script>

<template>
  <div class="">
    <div class="w-[100%] h-[220px] rounded flex items-center justify-center flex-col p-5 bg-[#f0f9ff]">
      <a-avatar style="background-color: #1890ff" :size="60" :src="userInfo.avatar">
        {{ userInfo.username }}
      </a-avatar>
      <span class="my-4 font-bold rounded text-sm px-2 py-1 bg-purple-200 text-purple-500">{{ userInfo.nickname }}</span>
    </div>
  </div>
</template>
