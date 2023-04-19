<script setup lang="ts">
import { message } from 'ant-design-vue'
import { Editor } from '@bytemd/vue-next'
import zhHans from 'bytemd/locales/zh_Hans.json'
import { plugins } from './plugins/index'
import 'bytemd/dist/index.css'
import './theme/smart-blue.css'
import { uploadSinlgeFile } from '@/api/file'

const spaceStore = useSpaceStore()
const versionId = computed(() => spaceStore.post?.currentVersionId as string)

const loading = computed(() => spaceStore.queryPostLoading)
const content = ref<string>('')

watchEffect(() => {
  content.value = spaceStore.post?.currentContent || ''
})

const updateServer = useDebounceFn(async () => {
  console.log('post to server')
  versionId.value && await spaceStore.updatePostVersion(versionId.value, content.value)
}, 1000)

function handleChange(value: string) {
  content.value = value
  updateServer()
}

async function uploadImages(files: File[]) {
  const list = []
  for (const file of files) {
    const close = message.loading('上传中')
    try {
      const res = await uploadSinlgeFile(file)
      if (!res.url) {
        throw new Error('未知错误')
      }
      close()
      message.success(`${file.name}上传成功`)
      list.push({ url: encodeURI(res.url) })
    }
    catch (e) {
      close()
      console.log(e)
      message.error(`${file.name}上传出错，请重试`)
    }
  }
  return list
}
</script>

<template>
  <div class="relative z-9 w-full h-[calc(100vh-50px)] p-2">
    <a-card class="w-full h-full">
      <div v-if="loading" class="p-2">
        <a-skeleton active />
      </div>
      <template v-else>
        <Editor
          v-if="spaceStore.currentId"
          class="h-full"
          :locale="zhHans"
          :plugins="plugins"
          :value="content"
          :upload-images="uploadImages"
          @change="handleChange"
        />
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
