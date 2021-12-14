<template>
  <div id="login">
    <div class="content">
      <div class="logo">
        <HeartTwoTone two-tone-color="#eb2f96" />
        <span>Remix管理系统</span>
      </div>
      <div class="title">使用账号登录</div>
      <a-form ref="formRef" :model="form" :rules="rules">
        <a-form-item name="username">
          <a-input
            placeholder="用户名"
            size="large"
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
            size="large"
            allow-clear
            @keyup.enter="handleLogin"
          />
        </a-form-item>
        <div class="space-around m-b-24">
          <div />
          <div class="color-333">忘记密码</div>
        </div>
        <a-form-item>
          <a-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click.stop="handleLogin"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
      <!-- <div class="space-around m-b-24">
        <div>
          <a-checkbox :checked="remember" @change="changeRemember">
            记住登录状态
          </a-checkbox>
        </div>
        <div class="color-333">立即注册</div>
      </div> -->
      <div class="third m-b-24">
        <span class="line" />
        <span class="txt"> 使用第三方登录 </span>
        <span class="line" />
      </div>
      <div></div>
    </div>
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
  .content {
    width: 370px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 6px 0px rgba(47, 51, 52, 0.2);
    padding: 32px 40px;
    .logo {
      img {
        width: 101px;
        height: 28px;
      }
    }
    .title {
      font-size: 24px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 33px;
      letter-spacing: 1px;
      padding: 25px 0 48px;
    }
    .login-btn {
      width: 100%;
    }
    .space-around {
      display: flex;
      justify-content: space-between;
    }
    .first {
      margin-bottom: 8px;
    }
    .m-b-24 {
      margin-bottom: 24px;
    }
    .color-333 {
      cursor: pointer;
      color: #333333;
      &:hover {
        color: #337dfe;
      }
    }
    .third {
      text-align: center;
      .line {
        display: inline-block;
        vertical-align: middle;
        border-top: 1px solid rgba(0, 0, 0, 0.07);
        width: 30px;
      }
      .txt {
        font-size: 12px;
        color: rgba(185, 185, 185, 1);
        padding: 0 12px;
      }
    }
    .wx {
      background-color: #49b247;
      border-color: #49b247;
    }
  }
}
</style>
