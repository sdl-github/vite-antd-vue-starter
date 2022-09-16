<template>
  <div id="app">
    <button @click="test">test</button>
    <FilePond
      ref="filePondRef"
      labelFileProcessing="上传中..."
      labelFileProcessingComplete="上传成功"
      labelFileProcessingError="上传出错"
      labelFileLoadError="加载出错"
      labelFileLoading="上传中..."
      labelTapToCancel="取消"
      labelTapToRetry="重试"
      labelTapToUndo="撤回"
      :label-idle="label"
      :name="name"
      :accepted-file-types="accepted"
      :server="server"
      :files="fileList"
      :allowMultiple="allowMultiple"
      :disabled="disabled"
      :maxFiles="maxFiles"
      @init="handleFilePondInit"
      @addfile="handleAddfile"
      @onaddfile="handleOnAddfile"
      @onupdatefiles="handleOnUpdatefiles"
    />
  </div>
</template>

<script setup lang="ts">
import vueFilePond from "vue-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import "filepond/dist/filepond.min.css";
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import { ref } from "vue";
import { FilePondServerConfigProps } from "filepond";
import { baseURL } from "@/utils/graphql/request";

type IProps = {
    name?: string
    label?: string
    url?: string
    accepted?: string
    disabled?: boolean
    allowMultiple?: boolean
    maxFiles?: number | null
}

const props = withDefaults(defineProps<IProps>(),{
    name: 'file',
    label: '点击/拖动文件到此处上传',
    accepted: 'image/jpeg, image/png',
    url: baseURL,
    maxFiles: 10
})

const FilePond = vueFilePond(
    FilePondPluginImagePreview
);
const fileList = ref(["cat.jpeg"])
const server:FilePondServerConfigProps['server']  = {
    url: props.url,
    fetch: {
        url: 'fetch',
        onload: e => {
            console.log(e);
            return e
        },
        ondata: res => {
            return res
        }
    },
    process: {
        url: "/file/upload",
        method: 'POST',
        ondata: formData => {
            return formData
        },
        onload: response => {
            const {data} = JSON.parse(response)
            return data
        }
    }
}
function handleFilePondInit() {
    console.log("FilePond has initialized");
}

function handleAddfile() {
    console.log("FilePond has handleAddfile");
}
function handleOnAddfile(file) {
    // console.log(file);
}
function handleOnUpdatefiles(fileList) {
    console.log("FilePond   handleOnUpdatefiles");

    console.log(fileList);
}
function test() {
    console.log(fileList.value);
}
</script>