<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

<script setup lang="ts">
import { reactive } from 'vue'
const state = reactive({
  url: '',
  loading: true,
  error: false,
})

const handleImageLoad = (_e: any, _img: any) => {
  state.loading = false
  state.error = false
}

const handleImageError = (_e: any) => {
  state.loading = false
  state.error = true
}

const handleImage = () => {
  // 重置状态
  state.loading = true
  state.error = false
  // 相当于给浏览器缓存了一张图片
  const img = new Image()
  img.onload = e => handleImageLoad(e, img)
  img.onerror = handleImageError
  img.src = state.url
}

const handleSetImage = () => {
  const date = new Date().valueOf()
  state.url = `https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg?time=${date}`
  handleImage()
}

const handleResetImage = () => {
  state.url = ''
  handleImage()
}

handleImage()
</script>

<template>
  <div class="app">
    <div class="action">
      <a-button type="primary" @click="handleResetImage">
        清除
      </a-button>
      <a-button type="primary" @click="handleSetImage">
        加载图片
      </a-button>
    </div>
    <a-card hoverable style="width: 240px">
      <template #cover>
        <div v-if="state.loading" class="loading">
          <a-spin />
        </div>
        <div v-else-if="state.error" class="error">
          <a-result status="warning" title="图片加载错误" />
        </div>
        <img v-else class="image" alt="example" :src="state.url">
      </template>
      <a-card-meta title="Europe Street beat" />
    </a-card>
  </div>
</template>

<style>
.app {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    flex-direction: column;
}
.action {
    width: 240px;
    display: flex;
    justify-content: space-between;
}
.loading {
    width: 240px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.error {
    width: 240px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.image {
    width: 240px;
    height: 400px;
}
</style>
