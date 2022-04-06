
<template>
  <a-menu
    mode="inline"
    :theme="theme"
    v-model:selectedKeys="state.selectedKeys"
    v-model:openKeys="state.openKeys"
  >
    <MenuItem v-for="menu in menus" :menu="menu" :key="menu.path" />
  </a-menu>
</template>

<script lang='ts'>
import { appStore } from "@/store/app";
import { computed, defineComponent, reactive, watchEffect } from "vue";
import RemixIcon from "@/components/RemixIcon.vue";
import MenuItem from "@/components/layout/MenuItem.vue";
import { useRoute } from "vue-router";
import {routes} from '@/router'

type IState = {
  selectedKeys: string[];
  openKeys: string[];
};

export default defineComponent({
  components: { RemixIcon, MenuItem },
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
      menus: routes,
    };
  },
});
</script>

<style scoped lang='scss'>
</style>