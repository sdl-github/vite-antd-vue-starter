<template>
  <a-layout class="layout">
    <a-layout-sider
      class="sider"
      v-model:collapsed="collapsed"
      :trigger="null"
      :theme='theme'
      collapsible
    >
      <Logo />
      <a-menu class="vab-menu" :theme="theme" mode="inline">
        <SideMenu v-for="route in routes" :key="route.path" :item="route" />
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="toggleCollapse"
        />
        <menu-fold-outlined v-else class="trigger" @click="toggleCollapse" />
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import SideMenu from "@/layout/components/SideMenu/index.vue";
import Logo from "@/layout/components/SideMenu/Logo.vue";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons-vue";
import { computed, defineComponent } from "vue";
import { appStore } from "@/store/app";
const routes = [
  {
    name: "Dashboard",
    title: "Dashboard",
    path: "/",
    hidden: false,
    icon: "<dashboard-outlined />",
    children: [
      {
        name: "test",
        title: "test",
        hidden: false,
        path: "/dashboard/index",
        icon: "<dashboard-outlined />",
        children: [
          {
            name: "test",
            title: "test",
            hidden: false,
            path: "/dashboard/index",
            icon: "<dashboard-outlined />",
          },
        ],
      },
    ],
  },
  {
    name: "Image",
    title: "Image",
    hidden: true,
    path: "/image",
    icon: "<dashboard-outlined />",
  },
];
export default defineComponent({
  components: {
    SideMenu,
    Logo,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
  setup() {
    const store = appStore();
    const toggleCollapse = store.toggleCollapse;

    return {
      collapsed: computed(() => store.collapsed),
      theme: computed(() => store.theme),
      toggleCollapse,
      routes,
    };
  },
});
</script>
<style scoped lang="scss">
.layout {
  .sider {
    height: 100vh;
  }
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
