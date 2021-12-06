<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu class="vab-menu" theme="dark" mode="inline">
        <SideMenu v-for="route in routes" :key="route.path" :item="route" />
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="toggleCollapse" />
        <menu-fold-outlined v-else class="trigger" @click="toggleCollapse" />
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
//@ts-ignore
import SideMenu from '@/layout/components/side-menu/index.vue'
import router from '@/router';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';
import { appStore } from '@/store/app';
import { mapActions } from 'pinia';
const store = appStore()
const collapsed = computed(() => store.collapsed)
const toggleCollapse = store.toggleCollapse
const routes = [
  {
    name: 'Dashboard',
    title: 'Dashboard',
    path: '/',
    hidden: false,
    icon: '<dashboard-outlined />',
    children: [
      {
        name: 'test',
        title: 'test',
        hidden: false,
        path: '/dashboard/index',
        icon: '<dashboard-outlined />'
      }
    ]
  },
  {
    name: 'Image',
    title: 'Image',
    hidden: true,
    path: '/image',
    icon: '<dashboard-outlined />'
  }
]
</script>
<style scoped lang="scss">
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
