<template>
  <a-layout class="layout">
    <a-layout-sider
      class="layout-sider"
      v-model:collapsed="collapsed"
      :trigger="null"
      :theme="theme"
      collapsible
    >
      <Logo />
      <SideMenu />
    </a-layout-sider>

    <a-layout class="main-layout">
      <Header />
      <Content />
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import Header from "@/components/layout/Header.vue";
import SideMenu from "@/components/layout/SideMenu.vue";
import Content from "@/components/layout/Content.vue";
import Logo from "@/components/layout/Logo.vue";
import { appStore } from "@/store/app";
import { computed, defineComponent } from "vue";

export default defineComponent({
  components: {
    Header,
    Logo,
    SideMenu,
    Content,
  },
  setup() {
    const store = appStore();
    return {
      collapsed: computed(() => store.collapsed),
      theme: computed(() => store.theme),
    };
  },
});
</script>

<style scoped lang="scss">
.layout {
  height: 100vh;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  .layout-sider {
    height: 100%;
  }
  .main-layout {
    min-height: 100%;
  }
}
</style>
