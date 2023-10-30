<script lang="ts" setup>
import { providerOption } from '../data'
import { FileProviderEnum } from '@/utils/graphql/zeus'
import FilePone from '@/components/file-pone/index.vue'

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
  <a-modal
    :open="open"
    :destroy-on-close="true"
    title="文件上传"
    :width="600"
    ok-text="关闭"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleOk"
  >
    <a-form
      ref="formRef"
      class="mt-5"
      :model="model"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <a-row :gutter="[16, 8]">
        <a-col :span="24">
          <a-form-item label="存储提供服务方" name="provider" :rules="rules.provider">
            <a-radio-group v-model:value="model.provider" button-style="solid">
              <a-radio-button v-for="option in providerOption" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <FilePone :data="model" />
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
