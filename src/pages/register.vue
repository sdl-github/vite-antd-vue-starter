<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { registerUser } from '~/api/auth'
import type { ModelTypes } from '~/utils/graphql/zeus'

const loading = ref(false)
const rules: Record<string, Rule[]> = {
  account: [{ required: true, validator: validateUsername, trigger: 'blur' }],
  nickName: [{ required: true, validator: validateRealName, trigger: 'blur' }],
  email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  password: [{ required: true, min: 6, message: '密码长度不能小于6', trigger: 'blur' }],
}
const formRef = ref<FormInstance>()
const passwordRef = ref()
const form = reactive<ModelTypes['UserRegisterInputInput']>({
  account: '',
  nickName: '',
  email: '',
  phone: '',
  password: '',
})
const router = useRouter()
function handleRegister() {
  formRef.value?.validate()
    .then(async () => {
      loading.value = true
      registerUser(form).then(async () => {
        notification.success({
          message: '注册成功',
        })
        router.push('/login')
      })
        .finally(() => {
          loading.value = false
        })
    })
}
</script>

<template>
  <div class="login-warp fixed z-10 h-[100vh] w-full flex overflow-hidden bg-cover">
    <div class="flex flex-1 items-center justify-center">
      <div class="w-[400px] rounded bg-white p-10">
        <div class="text-bold h-[50px] text-xl">
          {{ title }} 用户注册
        </div>
        <AForm ref="formRef" :model="form" :rules="rules">
          <AFormItem name="account">
            <AInput
              v-model:value="form.account" placeholder="用户名" allow-clear
              @keyup.enter="passwordRef.focus()"
            />
          </AFormItem>
          <AFormItem name="nickName">
            <AInput v-model:value="form.nickName" placeholder="姓名" allow-clear />
          </AFormItem>
          <AFormItem name="password">
            <AInputPassword
              ref="passwordRef" v-model:value="form.password" type="password" placeholder="密码"
              allow-clear
            />
          </AFormItem>
          <AFormItem name="email">
            <AInput v-model:value="form.email" placeholder="邮箱" allow-clear />
          </AFormItem>
          <AFormItem name="phone">
            <AInput v-model:value="form.phone" placeholder="手机" allow-clear />
          </AFormItem>
          <AFormItem>
            <AButton type="primary" class="w-full" :loading="loading" @click.stop="handleRegister">
              注册
            </AButton>
          </AFormItem>
          <div class="cursor-pointer">
            有账号 <RouterLink to="/login" class="text-blue-500">
              去登录
            </RouterLink>
          </div>
        </AForm>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-warp {
    background: radial-gradient(26.76% 85.52% at 86.73% -12.86%, #c241ff 6.65%, #6b57ff 100%);
    background: url('https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1673124817681-c236cd92ba67?ixid=MnwyNjY4NDZ8MHwxfHRvcGljfHxxUFlzRHp2Sk9ZY3x8fHx8Mnx8MTY4MDM5MTI0MQ&ixlib=rb-4.0.3&w=2560&h=1440&fmt=webp');
    min-height: 100vh;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
