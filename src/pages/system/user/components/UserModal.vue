<script setup lang="ts">
import { reactive, ref, toRefs, unref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import type { User, UserCreateInput, UserUpdateInput } from '../data'
import { GenderEnum } from '@/utils/graphql/zeus'
import UserRoleItem from '@/pages/system/user/components/UserRoleSelect.vue'
import { createUser, updateUser } from '@/api/user'

type ModelType = (UserCreateInput & UserUpdateInput)

interface Props {
  open: boolean
  currentItem: User | null
}
const props = withDefaults(defineProps<Props>(), {
  modelVisible: false,
  currentItem: null,
})

const emits = defineEmits(['update:open', 'ok', 'cancel'])

function generateModel(): ModelType {
  return {
    id: '',
    userName: '',
    nickName: '',
    password: '',
    phone: '',
    email: '',
    gender: GenderEnum.UNKNOWN,
    roleIds: [],
    note: '',
  }
}

const formRef = ref<FormInstance>()

const rules = {
  userName: [{ required: true, message: requireMessage('用户名') }],
  password: [{ required: true, message: requireMessage('密码') }],
  email: [{
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: '请输入正确的邮箱',
  }],
  phone: [{
    pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
    message: '请输入正确的手机号',
  }],
}

const confirmLoading = ref(false)
const state = reactive({
  model: generateModel(),
})

const { model } = toRefs(state)

watch(() => props.currentItem, (val) => {
  if (val?.id) {
    const { id, roles, userName = '', gender, nickName, phone, email } = val
    const roleIds = roles?.map(role => role?.id)
    state.model = { id, userName, nickName, gender, phone, email, roleIds }
  }
})

function requireMessage(key: string) {
  return `请输入${key}`
}

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (v) {
      const data = Object.assign({}, unref(model))
      const { id, userName, gender, nickName, password, phone, email, roleIds, note } = data
      const createInput: UserCreateInput = {
        userName,
        nickName,
        gender,
        password,
        phone,
        email,
        roleIds,
        note,
      }
      const updateInput: UserUpdateInput = {
        id,
        nickName,
        gender,
        phone,
        email,
        roleIds,
        note,
      }
      const api = data.id ? updateUser : createUser
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
    :width="600"
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
          <AFormItem label="用户名" name="userName" :rules="rules.userName">
            <AInput
              v-model:value="model.userName" :disabled="!!currentItem?.id"
              :placeholder="requireMessage('用户名')"
            />
          </AFormItem>
        </ACol>
        <ACol v-if="!currentItem?.id" :span="12">
          <AFormItem label="密码" name="password" :rules="rules.password">
            <AInput v-model:value="model.password" :placeholder="requireMessage('密码')" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="姓名" name="nickname">
            <AInput v-model:value="model.nickName" :placeholder="requireMessage('姓名')" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="邮箱" name="email" :rules="rules.email">
            <AInput v-model:value="model.email" :placeholder="requireMessage('邮箱')" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="手机号码" name="phone" :rules="rules.phone">
            <AInput v-model:value="model.phone" :placeholder="requireMessage('手机号码')" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="性别" name="gender">
            <ASelect v-model:value="model.gender" placeholder="请选择">
              <ASelectOption :value="GenderEnum.MALE">
                男
              </ASelectOption>
              <ASelectOption :value="GenderEnum.FEMALE">
                女
              </ASelectOption>
              <ASelectOption :value="GenderEnum.UNKNOWN">
                未知
              </ASelectOption>
            </ASelect>
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="角色" name="roleIds">
            <UserRoleItem v-model:value="model.roleIds" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="备注" name="note">
            <AInput v-model:value="model.note" :placeholder="requireMessage('备注')" />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<style lang="scss" scoped>
</style>
