<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

<script setup lang="tsx">
import { useTippy } from 'vue-tippy'
import { Picker, init } from 'emoji-mart'
import type { Emoji } from '@emoji-mart/data'
import data from '@emoji-mart/data'

const emojiRef = ref()

onMounted(() => {
  init({ data })
  const pickerOptions = { onEmojiSelect, data }
  emojiRef.value = new Picker(pickerOptions)
})

onUnmounted(() => {
  emojiRef.value = null
})

const tippy = useTippy(() => document.body, {
  content: <div id="emoji-picker"></div>,
  trigger: 'manual',
  placement: 'auto-end',
  arrow: false,
  interactive: true,
  offset: [0, 0],
})

function onEmojiSelect(e: Emoji) {
  console.log(e)
  tippy.hide()
}

function open(event: MouseEvent) {
  tippy.setProps({
    getReferenceClientRect: () => ({
      width: 0,
      height: 0,
      top: event.clientY,
      bottom: event.clientY,
      left: event.clientX,
      right: event.clientX,
    }),
  })
  tippy.show()
  nextTick(() => {
    const dom = document.querySelector('#emoji-picker')
    if (!dom?.hasChildNodes()) {
      dom?.appendChild(emojiRef.value as unknown as Node)
    }
  })
}
</script>

<template>
  <div class="" style="width:200vh;height:200vh">
    <div class="cursor-pointer" @click="open">
      emoji
      <em-emoji id="+1" size="1.5em" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
