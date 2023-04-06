<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
import 'tinymce/skins/content/default/content.css'
import 'tinymce/themes/silver'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'
import 'tinymce/models/dom'
import 'tinymce/icons/default/icons'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/code'

const value = ref('')
const tinymceId = 'tinymceId'
const initConfig = ref({
  selector: `#${tinymceId}`, // 富文本编辑器的id,
  language_url: 'tinymce/langs/zh_CN.js',
  skin_url: 'tinymce/skins/ui/oxide',
  language: 'zh_CN',
  height: 300, // 编辑器高度
  branding: false,
  menubar: true,
  image_dimensions: false,
})
onMounted(() => {
  tinymce.init({})
})
</script>

<template>
  <Editor id="tinymceId" v-model="value" :init="initConfig" />
</template>
