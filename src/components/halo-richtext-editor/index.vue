<script lang="ts" setup>
import '@sdl-life/halo-richtext-editor/dist/style.css'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'

import {
  ExtensionAudio,
  ExtensionBlockquote,
  ExtensionBold,
  ExtensionBulletList,
  ExtensionCode,
  ExtensionCodeBlock,
  ExtensionColor,
  ExtensionColumn,
  ExtensionColumns,
  ExtensionCommands,
  ExtensionDocument,
  ExtensionDraggable,
  ExtensionDropcursor,
  ExtensionFontSize,
  ExtensionGapcursor,
  ExtensionHardBreak,
  ExtensionHeading,
  ExtensionHighlight,
  ExtensionHistory,
  ExtensionHorizontalRule,
  ExtensionIframe,
  ExtensionImage,
  ExtensionIndent,
  ExtensionItalic,
  ExtensionLink,
  ExtensionNodeSelected,
  ExtensionOrderedList,
  ExtensionPlaceholder,
  ExtensionStrike,
  ExtensionSubscript,
  ExtensionSuperscript,
  ExtensionTable,
  ExtensionTaskList,
  ExtensionText,
  ExtensionTextAlign,
  ExtensionTrailingNode,
  ExtensionUnderline,
  ExtensionVideo,
  RichTextEditor,
  lowlight,
  useEditor,
} from '@sdl-life/halo-richtext-editor'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['update:content'])
const editor = useEditor({
  content: props.content,
  extensions: [
    ExtensionBlockquote,
    ExtensionBold,
    ExtensionBulletList,
    ExtensionCode,
    ExtensionDocument,
    ExtensionDropcursor.configure({
      width: 2,
      class: 'dropcursor',
      color: 'skyblue',
    }),
    ExtensionGapcursor,
    ExtensionHardBreak,
    ExtensionHeading,
    ExtensionHistory,
    ExtensionHorizontalRule,
    ExtensionItalic,
    ExtensionOrderedList,
    ExtensionStrike,
    ExtensionText,
    ExtensionImage.configure({
      HTMLAttributes: {
        loading: 'lazy',
      },
    }),
    ExtensionTaskList,
    ExtensionLink.configure({
      autolink: false,
      openOnClick: false,
    }),
    ExtensionTextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    ExtensionUnderline,
    ExtensionTable.configure({
      resizable: true,
    }),
    ExtensionSubscript,
    ExtensionSuperscript,
    ExtensionPlaceholder.configure({
      placeholder: '输入 / 以选择输入类型',
    }),
    ExtensionHighlight,
    ExtensionVideo,
    ExtensionAudio,
    ExtensionCommands,
    ExtensionCodeBlock.configure({
      lowlight,
    }),
    ExtensionIframe,
    ExtensionColor,
    ExtensionFontSize,
    ExtensionIndent,
    ExtensionDraggable,
    ExtensionColumns,
    ExtensionColumn,
    ExtensionNodeSelected,
    ExtensionTrailingNode,
  ],
  onUpdate: () => {
    const content = `${editor.value?.getHTML()}`
    const formatContent = unified()
      .use(rehypeParse)
      .use(rehypeFormat)
      .use(rehypeStringify)
      .processSync(content)
    emits('update:content', String(formatContent))
  },
})

onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="h-100% flex">
    <RichTextEditor v-if="editor" :editor="editor" locale="zh" />
  </div>
</template>
