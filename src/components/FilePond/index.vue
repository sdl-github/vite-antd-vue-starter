<script setup lang="ts">
import vueFilePond from 'vue-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import { ref } from 'vue'
import type { FilePondServerConfigProps } from 'filepond'
import { baseURL } from '@/utils/graphql/request'

interface IProps {
  name?: string
  label?: string
  url?: string
  accepted?: string
  disabled?: boolean
  allowMultiple?: boolean
  maxFiles?: number | null
}

const props = withDefaults(defineProps<IProps>(), {
  name: 'file',
  label: '点击/拖动文件到此处上传',
  accepted: 'image/jpeg, image/png',
  url: baseURL,
  maxFiles: 10,
})

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
)
const fileList = ref(['cat.jpeg'])
const server: FilePondServerConfigProps['server'] = {
  url: props.url,
  fetch: {
    url: 'fetch',
    onload: (e) => {
      console.log(e)
      return e
    },
    ondata: (res) => {
      return res
    },
  },
  process: {
    url: '/file/upload',
    method: 'POST',
    ondata: (formData) => {
      return formData
    },
    onload: (response) => {
      const { data } = JSON.parse(response)
      return data
    },
  },
}
function handleFilePondInit() {
  console.log('FilePond has initialized')
}

function handleAddfile() {
  console.log('FilePond has handleAddfile')
}
function handleOnAddfile(file) {
  // console.log(file);
}
function handleOnUpdatefiles(fileList) {
  console.log('FilePond   handleOnUpdatefiles')

  console.log(fileList)
}
function test() {
  console.log(fileList.value)
}
</script>

<template>
  <div id="app">
    <button @click="test">
      test
    </button>
    <FilePond
      ref="filePondRef"
      label-file-processing="上传中..."
      label-file-processing-complete="上传成功"
      label-file-processing-error="上传出错"
      label-file-load-error="加载出错"
      label-file-loading="上传中..."
      label-tap-to-cancel="取消"
      label-tap-to-retry="重试"
      label-tap-to-undo="撤回"
      :label-idle="label"
      :name="name"
      :accepted-file-types="accepted"
      :server="server"
      :files="fileList"
      :allow-multiple="allowMultiple"
      :disabled="disabled"
      :max-files="maxFiles"
      @init="handleFilePondInit"
      @addfile="handleAddfile"
      @onaddfile="handleOnAddfile"
      @onupdatefiles="handleOnUpdatefiles"
    />
  </div>
</template>
