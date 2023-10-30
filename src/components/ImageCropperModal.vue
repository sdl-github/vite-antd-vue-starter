<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const open = ref(false)
const loading = ref(false)
const src = ref('')
export function useModal() {
  return {
    setOpen(show: boolean) {
      open.value = show
    },
    start(url: string) {
      loading.value = true
      open.value = true
      const img = new Image()
      img.onload = () => {
        loading.value = false
        src.value = url
      }
      img.onerror = () => {
      }
      img.src = url
    },
  }
}
export default defineComponent({
  components: { Cropper },
  emits: ['ok'],
  setup(props, { emit }) {
    const { setOpen, start } = useModal()
    const cropper = ref<any>()
    const defaultSize = {
      width: 400,
      height: 400,
    }
    function handleOk() {
      const { canvas } = cropper.value?.getResult() as { canvas: HTMLCanvasElement }
      const base64 = canvas.toDataURL()
      /*
       * callback 回调函数，返回处理后的Blob
       * type   图片类型,默认格式为'image/png'
       * quality 图片压缩的质量（0-1）
       */
      canvas.toBlob((blob) => {
        emit('ok', {
          blob,
          base64,
        })
        setOpen(false)
      })
    }
    return {
      cropper,
      open,
      loading,
      defaultSize,
      src,
      setOpen,
      handleOk,
      start,
    }
  },
})
</script>

<template>
  <a-modal
    title="裁切图片" ok-text="确定" cancel-text="取消" :closable="false" :open="open" :mask="false" width="400px"
    @ok="handleOk" @cancel="setOpen(false)"
  >
    <div class="h-[400px] flex items-center justify-center">
      <template v-if="loading">
        <a-skeleton active />
      </template>
      <Cropper
        ref="cropper" :default-size="defaultSize" :src="src"
        :stencil-props="{ aspectRatio: 1 }"
      />
    </div>
  </a-modal>
</template>

<style lang="scss">

</style>
