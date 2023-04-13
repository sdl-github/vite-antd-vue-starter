<script setup lang="ts">
import { starPost, unStarPost } from '@/api/post'

const props = defineProps({
  postId: {
    type: String,
    default: '',
  },
  star: {
    type: Number,
    default: () => 0,
  },
  postUserStars: {
    type: Array,
    default: () => [],
  },
})
const userStore = useUserStore()
const stars = ref(0)
const isLike = ref(false)

watchEffect(() => {
  stars.value = props.star
  isLike.value = props?.postUserStars?.map(item => item.userId).includes(userStore.user?.id)
})

async function handleUnStar() {
  stars.value = stars.value - 1
  isLike.value = !isLike.value
  await unStarPost(props.postId)
}

async function handleStar() {
  stars.value = stars.value + 1
  isLike.value = !isLike.value
  await starPost(props.postId)
}
</script>

<template>
  <div v-if="isLike" class="i-ri-heart-fill text-[14px] color-red" @click.stop="handleUnStar" />
  <div v-else class="i-ri-heart-line text-[14px]" @click.stop="handleStar" />
  <div class="ml-1">
    {{ stars }}
  </div>
</template>
