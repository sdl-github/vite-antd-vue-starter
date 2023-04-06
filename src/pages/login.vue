<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { queryOauthUrl } from '@/api/auth'

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const loading = ref(false)
const oauthLoading = ref(false)
const formRef = ref<FormInstance>()
const passwordRef = ref()
const form = reactive({
  username: 'admin',
  password: 'admin',
})
const router = useRouter()
const userStore = useUserStore()
function handleLogin() {
  formRef.value?.validate()
    .then(async (v: any) => {
      loading.value = true
      const { username, password } = v
      const flag = await userStore.loginByAccount(username, password)
      loading.value = false
      if (!flag) {
        return
      }
      await router.push('/')
      notification.success({
        message: '登录成功',
        description: `欢迎 ${username}`,
      })
    })
    .catch((e: any) => {
      loading.value = false
    })
}

async function handleOauthLogin() {
  oauthLoading.value = true
  const url = await queryOauthUrl('github')
  window.location.href = url
  // oauthLoading.value = false
}
</script>

<template>
  <div class="login-warp flex z-10 h-[100vh] fixed w-full overflow-hidden bg-cover">
    <div class="flex-1 flex items-center justify-center p-[20px]">
      <div class="w-[300px] bg-white p-10 rounded">
        <div class="h-[50px] text-xl text-bold">
          登录
        </div>
        <a-form ref="formRef" :model="form" :rules="rules">
          <a-form-item name="username">
            <a-input v-model:value="form.username" placeholder="用户名" allow-clear @keyup.enter="passwordRef.focus()" />
          </a-form-item>
          <a-form-item name="password">
            <a-input-password
              ref="passwordRef" v-model:value="form.password" type="password" placeholder="密码" allow-clear
              @keyup.enter="handleLogin"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" class="w-full" :loading="loading" @click.stop="handleLogin">
              登录
            </a-button>
            <a-button class="w-full mt-2 flex items-center justify-center" :loading="oauthLoading" @click.stop="handleOauthLogin">
              <div class="i-ri-github-fill text-20px" />
              <div class="ml-2">
                Github 登录
              </div>
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-warp  {
  background: radial-gradient(26.76% 85.52% at 86.73% -12.86%,#c241ff 6.65%,#6b57ff 100%);
  background: url('https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1673124817681-c236cd92ba67?ixid=MnwyNjY4NDZ8MHwxfHRvcGljfHxxUFlzRHp2Sk9ZY3x8fHx8Mnx8MTY4MDM5MTI0MQ&ixlib=rb-4.0.3&w=2560&h=1440&fmt=webp');
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
