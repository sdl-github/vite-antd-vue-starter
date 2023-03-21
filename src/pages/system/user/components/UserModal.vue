<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { IUser, IUserActionModal } from '@/pages/system/user/data'
import UserRoleItem from '@/pages/system/user/components/UserRoleSelect.vue'
import { UserGenderEnum } from '@/utils/graphql/zeus'

const props = defineProps({
  modalVisible: {
    type: Boolean,
    default: false,
  },
  currentItem: {
    type: Object,
    default: () => {
    },
  },
})

const emits = defineEmits(['update:modalVisible', 'handleOk'])
const formRef = ref<FormInstance>()
const rules = {
  username: [{ required: true, message: requireMessage('用户名') }],
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
const formState = reactive<{ data: IUserActionModal }>({
  data: {
    id: '',
    username: '',
    nickname: '',
    password: '',
    email: '',
    phone: '',
    roleIds: [],
    gender: UserGenderEnum.MALE,
    note: '',
  },
})

watch(() => props.currentItem, (val) => {
  if (val.id) {
    const { roles } = val as IUser
    formState.data = { ...val, roleIds: roles?.map((item: any) => item?.id) } as IUserActionModal
  }
  else {
    formState.data = {} as IUserActionModal
  }
})
function requireMessage(key: string) {
  return `请输入${key}`
}

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (props.currentItem.id) {
      delete v.username
      v.id = props.currentItem.id
    }
    emits('handleOk', v)
  })
}

function handleCancel() {
  emits('update:modalVisible', false)
}
</script>

<template>
  <a-modal
    :visible="modalVisible" :destroy-on-close="true" :title="currentItem?.id ? '编辑' : ' 创建'"
    :confirm-loading="confirmLoading" :width="600" ok-text="确定" cancel-text="取消" @ok="handleOk" @cancel="handleCancel"
  >
    <a-form
      ref="formRef" :model="formState.data" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <a-row :gutter="[16, 8]">
        <a-col :span="12">
          <a-form-item label="用户名" name="username" :rules="rules.username">
            <a-input
              v-model:value="formState.data.username" :disabled="!!currentItem?.id"
              :placeholder="requireMessage('用户名')"
            />
          </a-form-item>
        </a-col>
        <a-col v-if="!currentItem?.id" :span="12">
          <a-form-item label="密码" name="password" :rules="rules.password">
            <a-input v-model:value="formState.data.password" :placeholder="requireMessage('密码')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="昵称" name="nickname">
            <a-input v-model:value="formState.data.nickname" :placeholder="requireMessage('昵称')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="邮箱" name="email" :rules="rules.email">
            <a-input v-model:value="formState.data.email" :placeholder="requireMessage('邮箱')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="手机号码" name="phone" :rules="rules.phone">
            <a-input v-model:value="formState.data.phone" :placeholder="requireMessage('手机号码')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" name="gender">
            <a-select v-model:value="formState.data.gender" placeholder="请选择">
              <a-select-option :value="UserGenderEnum.MALE">
                男
              </a-select-option>
              <a-select-option :value="UserGenderEnum.FEMALE">
                女
              </a-select-option>
              <a-select-option :value="UserGenderEnum.UNKNOWN">
                未知
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="角色" name="roleIds">
            <UserRoleItem v-model:value="formState.data.roleIds" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped>
</style>
