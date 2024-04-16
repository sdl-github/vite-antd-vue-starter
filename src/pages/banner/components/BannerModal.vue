<script setup lang="ts">
import { reactive, ref, toRefs, unref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import { generateFormModel } from '../data'
import type { FormModel } from '../data'
import { upload } from '~/api/file'
import { createBanner } from '~/api/banner'

interface Props {
  open: boolean
  currentItem: any | null
}
const props = withDefaults(defineProps<Props>(), {
  open: false,
  currentItem: null,
})

const emits = defineEmits(['update:open', 'ok', 'cancel'])

const formRef = ref<FormInstance>()

const confirmLoading = ref(false)
const state = reactive<{ model: FormModel }>({
  model: generateFormModel(),
})

const { model } = toRefs(state)

watchEffect(() => {
  if (!props.open)
    state.model = generateFormModel()

  if (props.open && props.currentItem && props.currentItem.id)
    state.model = Object.assign({}, props.currentItem)
})

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (v) {
      const data = Object.assign({}, unref(model))
      confirmLoading.value = true
      createBanner(data).then(() => {
        confirmLoading.value = false
        message.success('操作成功')
        emits('ok')
        handleCancel()
      }).catch(() => {
        confirmLoading.value = false
      })
    }
  })
}

function handleCancel() {
  state.model = generateFormModel()
  confirmLoading.value = false
  emits('update:open', false)
  emits('cancel')
}

async function handleUpload(e: UploadRequestOption) {
  const { file } = e
  const loading = message.loading('加载中', 0)
  try {
    const res = await upload(file, 'org')
    model.value.url = res.url
    model.value.desc = res.originName
    loading()
    return true
  }
  catch (e) {
    loading()
    return false
  }
}
</script>

<template>
  <AModal
    :open="open" :destroy-on-close="true" :title="currentItem?.id ? '编辑' : ' 创建'"
    :confirm-loading="confirmLoading" :width="600" ok-text="确定" cancel-text="取消" @ok="handleOk"
    @cancel="handleCancel"
  >
    <AForm
      ref="formRef" class="mt-5" :model="model" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <ARow :gutter="[16, 8]">
        <ACol :span="24">
          <AFormItem label="图片" name="url">
            <AImage :src="model.url" />
            <AUpload
              name="file"
              accept="image/png, image/jpeg, .webp"
              :show-upload-list="false"
              :custom-request="handleUpload"
            >
              <div class="relative cursor-pointer">
                <AButton>
                  点击上传
                </AButton>
              </div>
            </AUpload>
          </AFormItem>
        </ACol>
        <ACol :span="24">
          <AFormItem label="名称" name="desc">
            <AInput v-model:value="model.desc" placeholder="名称" />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<style lang="scss" scoped></style>
