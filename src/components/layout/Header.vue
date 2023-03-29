<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumb from './Breadcrumb.vue'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const { toggle } = appStore
const collapsed = computed(() => appStore.collapsed)
const user = computed(() => userStore.user)
const handleLogout = async () => {
  await userStore.exit()
  router.push(LOGIN_PATH)
}
</script>

<template>
  <a-layout-header class="layout-header">
    <div class="layout-action">
      <div
        class="trigger" :class="collapsed ? 'i-ri-menu-unfold-fill' : 'i-ri-menu-fold-fill'"
        @click="toggle"
      />
      <Breadcrumb />
    </div>

    <div class="user-info">
      <a-dropdown>
        <div>
          <a-avatar style="background-color: #1890ff" :src="user?.avatar">
            {{ user?.username }}
          </a-avatar>
          <span class="mx-2 rounded text-xs px-2 py-1 bg-purple-200 text-purple-500">{{ user?.nickname }}</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <template #icon>
                <div class="i-ri-user-line" />
              </template>
              <router-link to="/system/userInfo">
                个人信息
              </router-link>
            </a-menu-item>
            <a-menu-item @click="handleLogout">
              <template #icon>
                <div class="i-ri-logout-box-line" />
              </template>
              退出
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<style lang="scss" scoped>
.layout-header {
  position: sticky;
  top: 0;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  z-index: 1;
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
