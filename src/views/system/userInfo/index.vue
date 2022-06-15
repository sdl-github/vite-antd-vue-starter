<script setup lang="ts">
import { userStore } from '@/store/user';
import { computed } from 'vue';

const userState = userStore()
const userInfo = computed(() => userState.userInfo)

</script>

<template>
    <div class="flex">
        <div class="bg-white w-[350px] h-[300px] rounded flex flex-col items-center p-5">
            <img class="w-[100px] rounded-[50%]" :src="userInfo.avatar" />
            <h2 class="my-2 text-lg">
                {{ userInfo.nickname }}
                <span class="text-sm">{{ userInfo.phone }}</span>
            </h2>
            <div class="mt-2">
                <span class="bg-pink-100 text-sm text-pink-400 mx-2 px-2 py-1 rounded" v-for="role in userInfo.roles">
                    {{ role?.name }}</span>
            </div>
        </div>
    </div>
</template>