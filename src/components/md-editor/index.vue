<script setup lang="ts">
import './theme/smart-blue.css'
import 'bytemd/dist/index.css'
import gemoji from '@bytemd/plugin-gemoji'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import gfm from '@bytemd/plugin-gfm'
import { Editor } from '@bytemd/vue-next'
import copyCode from './plugins/copy-code'
import { updatePostVersion } from '@/api/post'

const plugins = [
  gemoji(),
  breaks(),
  frontmatter(),
  gfm(),
  copyCode(),
]
const spaceStore = useSpaceStore()
const versionId = computed(() => spaceStore.post?.currentVersionId as string)

const loading = computed(() => spaceStore.queryPostLoading)
const content = ref<string>('')

watchEffect(() => {
  content.value = spaceStore.post?.currentContent || ''
})

const updateServer = useDebounceFn(async () => {
  console.log('post to server')
  versionId.value && await updatePostVersion(versionId.value, content.value)
}, 5000)

function handleChange(value: string) {
  content.value = value
  updateServer()
}
</script>

<template>
  <div class="relative z-9 w-full h-[calc(100vh-50px)] p-2">
    <a-card class="w-full h-full">
      <div v-if="loading" class="p-2">
        <a-skeleton active />
      </div>
      <template v-else>
        <Editor v-if="spaceStore.currentId" :plugins="plugins" :value="content" class="h-full" @change="handleChange" />
        <div v-else class="flex justify-center pt-[20vh] h-full h-[100vh]">
          <div class="" />
        </div>
      </template>
    </a-card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-card-body) {
  height: 100%;
  padding: 0px;
}
:deep(.bytemd) {
  height: 100%;
}
</style>
