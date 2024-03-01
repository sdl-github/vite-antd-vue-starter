<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
import './data'

const tinymceId = 'tinymce'
const value = ref()
const disabled = ref(false)
const init = ref({
  selector: `#${tinymceId}`, // 富文本编辑器的id,
  language: 'zh-Hans', // 语言
  height: 400, // 编辑器高度
  menus: false,
})

onMounted(() => {
  tinymce.init({})
})
</script>

<template>
  <div>
    <Editor :id="tinymceId" v-model="value" :init="init" :disabled="disabled" />
  </div>
</template>
