<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import { loginByAccount } from '@/api/auth'

const loading = ref(false)

const formRef = ref<FormInstance>()
const passwordRef = ref()
const form = reactive({
  account: 'admin',
  password: 'admin',
})
const router = useRouter()
function handleLogin() {
  formRef.value?.validate()
    .then(async (v) => {
      loading.value = true
      const { account, password } = v
      loginByAccount(account, password).then(async ({ loginByAccount: accessToken }) => {
        if (!accessToken)
          return

        setToken(accessToken!)
        await router.push('/')
        notification.success({
          message: '登录成功',
          description: `欢迎 ${account}`,
        })
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
          登录
        </div>
        <AForm ref="formRef" :model="form">
          <AFormItem name="account">
            <AInput
              v-model:value="form.account"
              :rules="[{ required: true, message: '请输入用户名' }]"
              placeholder="用户名" allow-clear @keyup.enter="passwordRef.focus()"
            />
          </AFormItem>
          <AFormItem name="password">
            <AInputPassword
              ref="passwordRef"
              v-model:value="form.password"
              :rules="[{ required: true, message: '请输入密码' }]"
              type="password" placeholder="密码" allow-clear
              @keyup.enter="handleLogin"
            />
          </AFormItem>
          <AFormItem>
            <AButton type="primary" class="w-full" :loading="loading" @click.stop="handleLogin">
              登录
            </AButton>
          </AFormItem>
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
