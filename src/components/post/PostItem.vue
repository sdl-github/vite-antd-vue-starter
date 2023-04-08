<script lang="ts" setup>
defineProps({
  post: {
    type: Object,
    default: () => {},
  },
})
</script>

<template>
  <div class="bg-#fff rounded p-5 mb-2 w-720px">
    <div class="flex items-center text-[12px]">
      <div class="color-[#515767] cursor-pointer ml-1">
        {{ post.user.nickname || post.user.username }}
      </div>
      <div v-time class="color-[#8a919f] ml-2">
        {{ post.createdAt }}
      </div>
    </div>
    <div class="mt-3 text-[16px] font-bold leading-6 cursor-pointer">
      {{ post.title }}
    </div>
    <div class="mt-1 text-[14px] leading-6 cursor-pointer">
      {{ post.description }}
    </div>
    <div class="flex mt-4 items-center text-[12px]">
      <div class="color-[rgba(0,0,0,.45)] flex items-center cursor-pointer">
        <!-- <div class="i-ri-heart-line text-[14px]" /> -->
        <div class="i-ri-heart-fill text-[14px] color-red" />
        <div class="ml-1">
          10
        </div>
      </div>
      <div class="ml-2">
        <a-tag v-for="tag in post.tags" :key="tag.id" color="pink">
          #{{ tag.name }}
        </a-tag>
      </div>
    </div>
  </div>
</template>
