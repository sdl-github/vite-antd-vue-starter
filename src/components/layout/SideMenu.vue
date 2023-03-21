
<template>
  <a-layout-sider class="layout-sider" v-model:collapsed="collapsed" :trigger="null" :theme="theme" collapsible>
    <Logo />
    <a-menu mode="inline" :theme="theme" v-model:selectedKeys="state.selectedKeys" v-model:openKeys="state.openKeys">
      <MenuItem v-for="menu in menus" :menu="menu" :key="menu.path" />
    </a-menu>
  </a-layout-sider>
</template>

<script lang='ts' setup>
import { computed, reactive, watchEffect } from "vue";
import Logo from "@/components/layout/Logo.vue";
import MenuItem from "@/components/layout/MenuItem.vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { useMenu } from "@/composables/menu";

type IState = {
  selectedKeys: string[];
  openKeys: string[];
};
const route = useRoute();
const appStore = useAppStore()
const userStore = useUserStore()
const { menus } = useMenu()
const state = reactive<IState>({
  selectedKeys: [],
  openKeys: [],
});
const collapsed = computed(() => appStore.collapsed)

const theme = computed(() => appStore.theme)

watchEffect(() => {
  const { path, matched } = route;
  state.openKeys = matched.map((item) => item.path);
  state.selectedKeys = [path];
});

</script>

<style scoped lang='scss'>
.layout-sider {
  height: 100vh;
  position: sticky;
  top: 0;
}
</style>