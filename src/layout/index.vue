<template>
  <a-layout class="layout">
    <a-layout-sider
      class="sidebar"
      v-model:collapsed="collapsed"
      :trigger="null"
      :theme="theme"
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
      <a-layout-content class="content">
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
import { delHideMenu } from "@/utils/tools";

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
    const routes = computed(() => delHideMenu(store.routes));
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
  //font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  .sidebar {
    height: 100vh;
  }

  .content {
    margin: 24px 16px;
    padding: 24px;
    background-color: #fff;
    minheight: 280px;
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
</style>
