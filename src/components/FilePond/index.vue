<template>
  <div id="app">
    <FilePond
      ref="filePondRef"
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
    />
  </div>
</template>

<script setup lang="ts">
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import { ref } from "vue";
import { FilePondServerConfigProps } from "filepond";

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
    url: 'http://101.35.96.91:2333'
})

const FilePond = vueFilePond();
const fileList = ref([])
const server:FilePondServerConfigProps['server']  = {
    url: props.url,
    process: {
        url: "/file",
        method: 'POST',
        onload: res => {
            console.log(res);
            return res.key
        },
        ondata: formData => {
            console.log(formData);
            return formData
        }
    }
}
function handleFilePondInit() {
    console.log("FilePond has initialized");
}

function handleAddfile() {
    console.log("FilePond has handleAddfile");
}
</script>