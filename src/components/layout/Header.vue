<template>
  <a-layout-header class="layout-header">
    <div class="layout-action">
      <RemixIcon class="trigger" @click="setCollapsed(!collapsed)"
        :icon="collapsed ? 'menu-unfold-fill' : 'menu-fold-fill'" />
      <Breadcrumb />
    </div>

    <div class="user-info">
      <a-dropdown>
        <div>
          <a-avatar :src="userInfo.avatar" />
          <span class="mx-2 rounded text-sm px-2 py-1 bg-purple-200 text-purple-500">{{ userInfo.nickname }}</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <template #icon>
                <RemixIcon icon="user-line" />
              </template>
              <router-link to="/system/userInfo">个人信息</router-link>
            </a-menu-item>
            <a-menu-item @click="handleLogout">
              <template #icon>
                <RemixIcon icon='logout-box-line' />
              </template>
              退出
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>
<script lang="ts">
import RemixIcon from "@/components/RemixIcon.vue";
import Breadcrumb from "./Breadcrumb.vue";
import { computed, defineComponent } from "vue";
import { appStore } from "@/store/app";
import { userStore } from "@/store/user";
import { LOGIN_PATH } from "@/router";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Header",
  components: { RemixIcon, Breadcrumb },
  setup() {
    const store = appStore();
    const user = userStore();
    const router = useRouter();
    const handleLogout = async () => {
      await user.logout();
      router.push(LOGIN_PATH);
    };
    return {
      theme: computed(() => store.theme),
      collapsed: computed(() => store.collapsed),
      userInfo: computed(() => user.userInfo),
      setCollapsed: store.setCollapsed,
      handleLogout,
    };
  },
});
</script>

<style lang="scss" scoped>
.layout-header {
  position: sticky;
  top: 0;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  z-index: 10;
  height: 50px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  background: #fff;
  padding: 0;

  .layout-action {
    display: flex;
    align-items: center;
    height: 50px;
  }
}

.user-info {
  cursor: pointer;
  margin-right: 20px;
}

.trigger {
  font-size: 18px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}
</style>
