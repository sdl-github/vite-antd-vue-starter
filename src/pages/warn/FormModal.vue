<script setup lang="ts">
import { reactive, ref, toRefs, unref, watch } from 'vue'
import type { FormInstance, UploadProps } from 'ant-design-vue'
import { Upload, message } from 'ant-design-vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import type { WarnEvent, WarnEventCreateInput, WarnEventUpdateInput } from './data'
import { createWarnEventPage, updateWarnEventPage } from '~/api/warn'
import { upload } from '~/api/file'

type ModelType = (WarnEventCreateInput & WarnEventUpdateInput)

interface Props {
  open: boolean
  currentItem: WarnEvent | null
}
const props = withDefaults(defineProps<Props>(), {
  open: false,
  currentItem: null,
})

const emits = defineEmits(['update:open', 'ok', 'cancel'])

function generateModel(): ModelType {
  return {
    id: '',
    title: '',
    code: '',
    level: '',
    location: '',
    warnTime: '',
    fileUrl: '',
    name: '',
  }
}

const formRef = ref<FormInstance>()

const rules = {
  required: [{ required: true, message: '必填项' }],
}

const confirmLoading = ref(false)
const state = reactive({
  model: generateModel(),
})

const { model } = toRefs(state)

watch(() => props.currentItem, (val) => {
  if (val?.id)
    state.model = JSON.parse(JSON.stringify(val))
})

function requireMessage(key: string) {
  return `请输入${key}`
}

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (v) {
      const data = Object.assign({}, unref(model))
      const { id, name, title, code, level, location, warnTime, fileUrl } = data
      const createInput: WarnEventCreateInput = {
        name,
        title,
        code,
        level,
        location,
        warnTime,
        fileUrl,
      }
      const updateInput: WarnEventUpdateInput = {
        id,
        name,
        title,
        code,
        level,
        location,
        warnTime,
        fileUrl,
      }
      const api = data.id ? updateWarnEventPage : createWarnEventPage
      const input = (data.id ? updateInput : createInput) as ModelType
      confirmLoading.value = true
      api(input).then(() => {
        confirmLoading.value = false
        message.success('操作成功')
        emits('ok')
        handleCancel()
      }).catch((e) => {
        confirmLoading.value = false
      })
    }
  })
}

function handleCancel() {
  state.model = generateModel()
  confirmLoading.value = false
  emits('update:open', false)
  emits('cancel')
}
async function customRequest({ file }: UploadRequestOption) {
  const loading = message.loading('加载中', 0)
  try {
    const res = await upload(file as File)
    state.model.fileUrl = res.url
    loading()
    message.success('成功')
  }
  catch (e) {
    loading()
  }
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const jsJpgOrMp4 = file.type === 'image/jpeg' || file.type === 'video/mp4'
  if (!jsJpgOrMp4)
    message.error(`${file.name} 不是jpg/mp4文件`)
  return jsJpgOrMp4 || Upload.LIST_IGNORE
}
</script>

<template>
  <AModal
    :open="open" :destroy-on-close="true" :title="currentItem?.id ? '编辑' : ' 创建'" :confirm-loading="confirmLoading"
    :width="600" ok-text="确定" cancel-text="取消" @ok="handleOk" @cancel="handleCancel"
  >
    <AForm
      ref="formRef" class="mt-5" :model="model"
      autocomplete="off"
    >
      <ARow :gutter="[16, 8]">
        <ACol :span="12">
          <AFormItem label="告警编号" name="code" :rules="rules.required">
            <AInput v-model:value="model.code" :placeholder="requireMessage('告警编号')" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="告警时间" name="warnTime" :rules="rules.required">
            <ADatePicker
              v-model:value="model.warnTime" placeholder="开始时间" :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="告警人" name="name" :rules="rules.required">
            <AInput v-model:value="model.name" :placeholder="requireMessage('告警人')" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="告警等级" name="level" :rules="rules.required">
            <AInput v-model:value="model.level" :placeholder="requireMessage('告警等级')" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="告警位置" name="location" :rules="rules.required">
            <AInput v-model:value="model.location" :placeholder="requireMessage('告警位置')" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="告警内容" name="title" :rules="rules.required">
            <AInput v-model:value="model.title" :placeholder="requireMessage('告警内容')" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="告警文件" name="fileUrl" :rules="rules.required">
            <AUpload
              name="file"
              action="/"
              :max-count="1"
              :show-upload-list="false"
              :custom-request="customRequest"
              :before-upload="beforeUpload"
            >
              <AButton>
                <UploadOutlined />
                上传文件
              </AButton>
            </AUpload>
            {{ model.fileUrl }}
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<style lang="scss" scoped></style>
