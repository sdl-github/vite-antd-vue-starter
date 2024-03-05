<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import type { Role, RoleCreateInput, RoleUpdateInput } from '../data'

import { createRole, updateRole } from '@/api/role'

type ModelType = (RoleCreateInput & RoleUpdateInput)

interface Props {
  open: boolean
  currentItem: Role | null
}
const props = withDefaults(defineProps<Props>(), {
  modelVisible: false,
  currentItem: null,
})

const emits = defineEmits(['ok', 'cancel'])

function generateModel(): ModelType {
  return {
    id: '',
    name: '',
    level: 0,
    key: '',
  }
}

const formRef = ref<FormInstance>()

const rules = {
  name: [{ required: true, message: requireMessage('权限名称') }],
  key: [{ required: true, message: requireMessage('权限标识') }],
  level: [{ required: true, message: requireMessage('权限等级') }],
}

const confirmLoading = ref(false)
const state = reactive({
  model: generateModel(),
})

const { model } = toRefs(state)

watch(() => props.currentItem, (val) => {
  if (val?.id) {
    const { id, name = '', key = '', level = 0 } = val
    state.model = { id, name, key, level }
  }
})

function requireMessage(key: string) {
  return `请输入${key}`
}

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (v) {
      const data = Object.assign({}, unref(model))
      const { id, name, key, level } = data
      const createInput: RoleCreateInput = {
        name,
        key,
        level,
      }
      const updateInput: RoleUpdateInput = {
        id,
        name,
        key,
        level,
      }
      const api = data.id ? updateRole : createRole
      const input = (data.id ? updateInput : createInput) as ModelType
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
  state.model = generateModel()
  confirmLoading.value = false
  emits('cancel')
}
</script>

<template>
  <AModal
    :open="open"
    :destroy-on-close="true"
    :title="currentItem?.id ? '编辑' : ' 创建'"
    :confirm-loading="confirmLoading"
    :width="400"
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
        <ACol :span="24">
          <AFormItem label="权限名称" name="name" :rules="rules.name">
            <AInput
              v-model:value="model.name"
              :placeholder="requireMessage('权限名称')"
            />
          </AFormItem>
        </ACol>
        <ACol :span="24">
          <AFormItem label="权限标识" name="key" :rules="rules.key">
            <AInput v-model:value="model.key" :placeholder="requireMessage('权限标识')" />
          </AFormItem>
        </ACol>
        <ACol :span="24">
          <AFormItem label="权限等级" name="level" :rules="rules.level">
            <AInputNumber v-model:value="model.level" :placeholder="requireMessage('权限等级')" class="w-full" />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<style lang="scss" scoped>
</style>
