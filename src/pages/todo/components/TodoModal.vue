<script setup lang="ts">
import { reactive, ref, toRefs, unref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { generateFormModel } from '../data'
import type { CreateTodoInput, FormModel, Todo, UpdateTodoInput } from '../data'
import { createTodo, updateTodo } from '@/api/todo'

interface Props {
  open: boolean
  currentItem: Todo | null
}
const props = withDefaults(defineProps<Props>(), {
  modelVisible: false,
  currentItem: null,
})

const emits = defineEmits(['update:open', 'ok', 'cancel'])

const formRef = ref<FormInstance>()

const rules = {
  title: [{ required: true, message: requireMessage('标题') }],
}

const confirmLoading = ref(false)
const state = reactive({
  model: generateFormModel(),
})

const { model } = toRefs(state)

watch(() => props.currentItem, (val) => {
  if (val?.id) {
    // Todo
  }
})

function requireMessage(key: string) {
  return `请输入${key}`
}

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (v) {
      const data = Object.assign({}, unref(model))
      const { id, ...others } = data
      const createInput: CreateTodoInput = {
        ...others,
      }
      const updateInput: UpdateTodoInput = {
        ...others,
        id,
      }
      const api = data.id ? updateTodo : createTodo
      const input = (data.id ? updateInput : createInput) as FormModel
      confirmLoading.value = true
      api(input).then(() => {
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
</script>

<template>
  <AModal
    :open="open"
    :destroy-on-close="true"
    :title="currentItem?.id ? '编辑' : ' 创建'"
    :confirm-loading="confirmLoading"
    :width="800"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleCancel"
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
        <ACol :span="12">
          <AFormItem label="图标" name="icon">
            <AInput
              v-model:value="model.icon"
              :placeholder="requireMessage('图标')"
            />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="标题" name="title" :rules="rules.title">
            <AInput
              v-model:value="model.title"
              :placeholder="requireMessage('标题')"
            />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="内容" name="content">
            <AInput
              v-model:value="model.content"
              :placeholder="requireMessage('内容')"
            />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="计划完成时间" name="planDate">
            <ADatePicker v-model:value="model.planDate" show-time placeholder="计划完成时间" class="w-full" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="提醒时间" name="warnDate">
            <ADatePicker v-model:value="model.warnDate" show-time placeholder="提醒时间" class="w-full" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="完成时间" name="doneDate">
            <ADatePicker v-model:value="model.doneDate" show-time placeholder="完成时间" class="w-full" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="优先级" name="sort">
            <AInputNumber v-model:value="model.sort" :min="0" class="w-full" />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<style lang="scss" scoped>
</style>
