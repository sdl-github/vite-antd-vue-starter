<template>
  <div class="layout">
    <a-layout>
      <a-layout-sider
        class="layout-sider"
        v-model:collapsed="collapsed"
        :trigger="null"
        :theme="theme"
        collapsible
      >
        <Logo />
        <a-menu
          :theme="theme"
          mode="inline"
          v-model:selectedKeys="state.selectedKeys"
          v-model:openKeys="state.openKeys"
        >
          <SideMenu v-for="route in routes" :key="route.path" :item="route" />
        </a-menu>
      </a-layout-sider>

      <a-layout class="main-layout">
        <Header />
        <Main />
      </a-layout>
    </a-layout>
  </div>
</template>
<script lang="ts">
import SideMenu from "@/layout/components/SideMenu/index.vue";
import Logo from "@/layout/components/Logo.vue";
import Main from "@/layout/components/Main.vue";
import Header from "@/layout/components/Header.vue";
import { appStore } from "@/store/app";
import { computed, defineComponent, reactive, watchEffect } from "vue";
import { delHideMenu } from "@/utils/tools";
import { useRoute } from "vue-router";
type IState = {
  selectedKeys: string[];
  openKeys: string[];
};
export default defineComponent({
  components: {
    Header,
    SideMenu,
    Logo,
    Main,
  },
  setup() {
    let state = reactive<IState>({
      selectedKeys: [],
      openKeys: [],
    });
    const store = appStore();
    const toggleCollapse = store.toggleCollapse;
    const routes = computed(() => delHideMenu(store.routes));
    const route = useRoute();
    const { path, matched } = route;

    watchEffect(() => {
      state.openKeys = [matched[0].path];
      state.selectedKeys = [path];
    });

    return {
      collapsed: computed(() => store.collapsed),
      theme: computed(() => store.theme),
      toggleCollapse,
      routes,
      state,
    };
  },
});
</script>

<style scoped lang="scss">
.layout {
  height: 100vh;
  //font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  .layout-sider {
    //height: 100%;
  }
  .main-layout {
    min-height: 100vh;
    //padding-left: 250px;
    //transition: all 0.2s;
  }
}
</style>
