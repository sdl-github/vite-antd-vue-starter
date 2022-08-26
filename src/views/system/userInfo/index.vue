<script setup lang="ts">
import FilePond from '@/components/FilePond/index.vue'
import { userStore } from '@/store/user';
import { computed } from 'vue';

const userState = userStore()
const userInfo = computed(() => userState.userInfo)

</script>

<template>
    <div class="">
        <div class="w-[100%] h-[120px] rounded flex items-center p-5 bg-[#f0f9ff]">
            <a-avatar style="background-color: #1890ff" :size="50" :src="userInfo.avatar">{{ userInfo.username }}</a-avatar>
            <span class="mx-2 font-bold rounded text-sm px-2 py-1 bg-purple-200 text-purple-500">{{ userInfo.nickname }}</span>
        </div>

        <div class="bg-white w-[100%] h-[600px] rounded p-5 mt-2">
            <FilePond/>
        </div>
    </div>
</template>