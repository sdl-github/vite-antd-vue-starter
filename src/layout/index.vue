<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1" @click="changeMenu('image')">
          <user-outlined />
          <span class="nav-text">图片加载</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span class="nav-text">nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <upload-outlined />
          <span class="nav-text">nav 3</span>
        </a-menu-item>
        <a-menu-item key="4">
          <user-outlined />
          <span class="nav-text">nav 4</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '520px' }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">©{{ new Date().getFullYear() }} Created by sdl</a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import router from '@/router';
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'Layout',
  components: {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
  },
  setup() {
    const onCollapse = (collapsed: boolean, type: string) => {
      console.log(collapsed, type);
    };

    const onBreakpoint = (broken: boolean) => {
      console.log(broken);
    };

    const changeMenu = (path: string) => {
      console.log(path);
      router.push(path);
    }               
    return {
      selectedKeys: ref<string[]>(['1']),
      onCollapse,
      onBreakpoint,
      changeMenu
    };
  },
});
</script>
<style lang="scss">
.logo {
  height: 50px;
}
</style>
