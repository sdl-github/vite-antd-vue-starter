<script lang="ts" setup>
import { format } from 'timeago.js'

defineProps({
  post: {
    type: Object,
    default: () => {},
  },
})
function formatTimeAgo(data: string) {
  return format(data, 'zh_CN')
}
</script>

<template>
  <div class="bg-#fff rounded p-5 mb-2 w-820px">
    <div class="flex items-center text-[12px]">
      <div class="color-[#515767] cursor-pointer ml-1">
        {{ post.user.nickname || post.user.username }}
      </div>
      <div class="color-[#8a919f] ml-2">
        {{ formatTimeAgo(post.createdAt) }}
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
        <PostStar
          :post-id="post.id"
          :star="post.star"
          :post-user-stars="post.postUserStars"
        />
      </div>
      <div class="ml-2">
        <a-tag v-for="tag in post.tags" :key="tag.id" color="pink">
          #{{ tag.name }}
        </a-tag>
      </div>
    </div>
  </div>
</template>
