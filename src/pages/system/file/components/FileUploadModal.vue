<script lang="ts" setup>
import { providerOption } from '../data'
import { FileProviderEnum } from '@/utils/graphql/zeus'

// import FilePone from '@/components/file-pone/index.vue'

interface Props {
  open: boolean
}
const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emits = defineEmits(['update:open', 'ok'])
const formRef = ref()

const rules = {
  provider: [{ required: true, message: '请选择' }],
  bucket: [{ required: true, message: '请选择' }],
}
const state = reactive({
  model: generateModel(),
})

function generateModel() {
  return {
    provider: FileProviderEnum.BITIFUL_S4,
    bucket: 'space',
  }
}
const { model } = toRefs(state)

function handleOk() {
  emits('update:open', false)
  emits('ok')
}
</script>

<template>
  <AModal
    :open="open"
    :destroy-on-close="true"
    title="文件上传"
    :width="600"
    ok-text="关闭"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleOk"
  >
    <AForm
      ref="formRef"
      class="mt-5"
      :model="model"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <ARow :gutter="[16, 8]">
        <ACol :span="24">
          <AFormItem label="存储提供服务方" name="provider" :rules="rules.provider">
            <ARadioGroup v-model:value="model.provider" button-style="solid">
              <ARadioButton v-for="option in providerOption" :key="option.value" :value="option.value">
                {{ option.label }}
              </ARadioButton>
            </ARadioGroup>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>
