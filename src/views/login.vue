<template>
  <div class="flex z-10 h-[100vh] fixed w-full overflow-hidden bg-cover">
    <div class="flex-1 flex items-center justify-center p-[20px]">
      <div class="w-[400px] bg-white p-10 rounded">
        <div class="h-[50px] text-xl text-bold">登录</div>
        <a-form ref="formRef" :model="form" :rules="rules">
          <a-form-item name="username">
            <a-input
                placeholder="用户名"
                allow-clear
                v-model:value="form.username"
                @keyup.enter="passwordRef.focus()"
            />
          </a-form-item>
          <a-form-item name="password">
            <a-input-password
                ref="passwordRef"
                type="password"
                v-model:value="form.password"
                placeholder="密码"
                allow-clear
                @keyup.enter="handleLogin"
            />
          </a-form-item>
          <a-form-item>
            <a-button
                type="primary"
                class="login-btn"
                :loading="loading"
                @click.stop="handleLogin"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FormInstance, notification} from "ant-design-vue";
import {ref, reactive} from "vue";
import {useRouter} from "vue-router";
import {userStore} from "@/store/user";

const rules = {
  username: [{required: true, message: "请输入用户名", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
};
let loading = ref(false);
const formRef = ref<FormInstance>();
const passwordRef = ref();
const form = reactive({
  username: "admin",
  password: "admin",
});
const router = useRouter();
const store = userStore();
const handleLogin = () => {
  formRef.value?.validate()
      .then(async (v: any) => {
        loading.value = true
        const {username, password} = v;
        const flag = await store.login(username, password);
        if (!flag) {
          return;
        }
        loading.value = false
        await router.push("/");
        notification.success({
          message: "登录成功",
          description: `欢迎 ${username}`,
        });
      })
      .catch((e: any) => {
      });
};
</script>

<style lang="scss" scoped>
#login {
  background: rgba(244, 244, 244, 1);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-btn {
  width: 100%;
}
</style>
