<script lang="ts" setup>
import { Editor } from '@textbus/xnote'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:content'])

const editor = new Editor({
  content: props.content,
  readonly: props.readonly,
})
const editorRef = ref<Editor>()

onMounted(() => {
  editor.mount(editorRef.value as any).then(() => {
    console.log('编辑器准备完成。')
  })
  editor.onChange.subscribe(() => {
    const htmlContent = editor.getHTML()
    console.log('htmlContent=>', htmlContent)
    emits('update:content', htmlContent)
  })
})

onUnmounted(() => {
  editor.destroy()
})
</script>

<template>
  <div class="h-full w-full">
    <div v-if="editor" ref="editorRef" :editor="editor" />
  </div>
</template>

<style lang="scss">
@import '@textbus/xnote/bundles/index.css'
</style>
