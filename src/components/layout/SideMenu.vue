
<template>
  <a-layout-sider class="layout-sider" v-model:collapsed="collapsed" :trigger="null" :theme="theme" collapsible>
    <Logo />
    <a-menu mode="inline" :theme="theme" v-model:selectedKeys="state.selectedKeys" v-model:openKeys="state.openKeys">
      <MenuItem v-for="menu in menus" :menu="menu" :key="menu.path" />
    </a-menu>
  </a-layout-sider>

</template>

<script lang='ts'>
import { appStore } from "@/store/app";
import { computed, defineComponent, reactive, watchEffect } from "vue";
import Logo from "@/components/layout/Logo.vue";
import RemixIcon from "@/components/RemixIcon.vue";
import MenuItem from "@/components/layout/MenuItem.vue";
import { useRoute } from "vue-router";

type IState = {
  selectedKeys: string[];
  openKeys: string[];
};

export default defineComponent({
  components: { RemixIcon, MenuItem, Logo },
  setup() {
    const state = reactive<IState>({
      selectedKeys: [],
      openKeys: [],
    });
    const store = appStore();
    const route = useRoute();
    watchEffect(() => {
      const { path, matched } = route;
      state.openKeys = [matched[0].path];
      state.selectedKeys = [path];
    });
    return {
      collapsed: computed(() => store.collapsed),
      theme: computed(() => store.theme),
      state,
      menus: computed(() => store.sideMenu),
    };
  },
});
</script>

<style scoped lang='scss'>
.layout-sider {
  height: 100vh;
  position: sticky;
  top: 0;
}
</style>