<template>
  <div id="login">
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
</template>

<script setup lang="ts">
import { setToken } from "@/utils/auth";
import { notification } from "ant-design-vue";
import { HeartTwoTone } from "@ant-design/icons-vue";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const loading = ref(false);
const formRef = ref();
const passwordRef = ref();
const form = reactive({
  username: "",
  password: "",
});
const router = useRouter();
const handleLogin = () => {
  formRef.value
    .validate()
    .then((v: any) => {
      const { username, password } = v;
      console.log(v);
      // TODO
      setToken(username);
      router.push("/");
      notification.success({
        message: "登录成功",
        description: `欢迎 ${username}`,
      });
    })
    .catch((e: any) => {});
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
  width: 236px;
}
</style>
