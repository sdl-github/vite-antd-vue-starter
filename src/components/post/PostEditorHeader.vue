<script setup lang="ts">
// import { formatDate } from '@vueuse/core'
import dayjs from 'dayjs'
import { LoadingOutlined } from '@ant-design/icons-vue'
const router = useRouter()
const spaceStore = useSpaceStore()
const saveLoading = computed(() => spaceStore.updatePostLoading)
const loading = computed(() => spaceStore.queryPostLoading)
const post = computed(() => spaceStore.post)
const published = computed(() => spaceStore.post?.published)
const breadcrumbs = computed(() => {
  return spaceStore.spaceLineMenus?.map(menu => menu.title)
})
const open = ref(false)

function handlePreview() {
  const id = spaceStore.post?.id
  const route = router.resolve(`/post/${id}`)
  window.open(route.href, '_blank')
}

function formatDate(date: string) {
  return date && dayjs(date).format('YYYY-MM-DD hh:mm:ss')
}
</script>

<template>
  <div class="h-50px w-full bg-white flex items-center justify-between px-4">
    <template v-if="loading">
      <a-skeleton-input style="width: 200px" active size="small" />
    </template>

    <template v-else>
      <div v-if="spaceStore.currentId" class="flex flex-col">
        <a-breadcrumb>
          <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
            <span class="text-[1.2em]">{{ breadcrumb }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
        <div class="flex items-center color-#8a919f text-12px">
          <LoadingOutlined v-if="saveLoading" class="mr-2 color-#4096ff" />
          <div class="mr-2">
            <template v-if="saveLoading">
              保存中
            </template>
            <template v-else>
              <span class="color-#4096ff">已保存</span>
            </template>
          </div>
          <div class="">
            {{ formatDate(post?.updatedAt) }}
          </div>
        </div>
      </div>
      <template v-if="spaceStore.currentId">
        <template v-if="published">
          <div class="flex">
            <a-button class="ml-4 flex items-center" @click="open = true">
              <div class="i-ri-settings-3-line" />
              <div class="ml-2">
                文章设置
              </div>
            </a-button>
            <a-button class="ml-4 flex items-center" type="primary" @click="handlePreview">
              <div class="i-ri-send-plane-fill" />
              <div class="ml-2">
                查看页面
              </div>
            </a-button>
          </div>
        </template>

        <a-button v-else class="ml-4 flex items-center" @click="open = true">
          <div class="i-ri-settings-3-line" />
          <div class="ml-2">
            发布
          </div>
        </a-button>
      </template>
    </template>
  </div>
  <PublishDrawer v-model:open="open" />
</template>
