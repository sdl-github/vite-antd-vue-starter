
<template>
  <a-menu
    mode="inline"
    :theme="theme"
    v-model:selectedKeys="state.selectedKeys"
    v-model:openKeys="state.openKeys"
  >
    <template v-for="menu in menus" :key="menu.path">
      <a-menu-item class="menu-item">
        <template #icon>
          <RemixIcon :icon="menu.icon" />
        </template>
        <span>
          {{ menu.title }}
        </span>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script lang='ts'>
import { appStore } from "@/store/app";
import { computed, defineComponent, reactive } from "vue";
import RemixIcon from "@/components/RemixIcon.vue";

const menus: any = [
  {
    title: "Dashboard",
    icon: "folder-user-line",
    path: "/",
  },
  {
    title: "系统管理",
    icon: "folder-user-line",
    path: "/system",
    chileren: [
      {
        title: "用户管理",
        icon: "folder-user-line",
        path: "/system/user",
      },
      {
        title: "权限管理",
        icon: "folder-user-line",
        path: "/system/user",
      },
      {
        title: "角色管理",
        icon: "folder-user-line",
        path: "/system/user",
      },
    ],
  },
];

export default defineComponent({
  components: { RemixIcon },
  setup() {
    const state = reactive({
      selectedKeys: [],
      openKeys: [],
    });
    const store = appStore();
    return {
      collapsed: computed(() => store.collapsed),
      theme: computed(() => store.theme),
      state,
      menus,
    };
  },
});
</script>

<style scoped lang='scss'>
</style>