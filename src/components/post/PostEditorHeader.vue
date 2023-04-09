<script setup lang="ts">
const router = useRouter()
const spaceStore = useSpaceStore()
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
</script>

<template>
  <div class="h-50px w-full bg-white flex items-center justify-between px-4">
    <div>
      <a-breadcrumb>
        <a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
          <span class="text-[1.2em]">{{ breadcrumb }}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
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
  </div>
  <PublishDrawer v-model:open="open" />
</template>
