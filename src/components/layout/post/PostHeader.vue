<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const { toggle } = appStore
const collapsed = computed(() => appStore.collapsed)
const user = computed(() => userStore.user)
async function handleLogout() {
  await userStore.exit()
  router.push(LOGIN_PATH)
}

function goEditor() {
  router.push('/post/edit')
}

function goLogin() {
  router.push('/login')
}

function goHome() {
  router.push('/post')
}
</script>

<template>
  <div class="layout-header">
    <div class="min-w-820px max-w-1440px m-auto flex items-center justify-between">
      <div class="text-xl font-bold gradient-text cursor-pointer" @click="goHome">
        记事本
      </div>
      <div class="cursor-pointer flex items-center">
        <template v-if="user?.id">
          <a-dropdown>
            <div>
              <a-avatar style="background-color: #1890ff" :src="user?.avatar">
                {{ user?.username }}
              </a-avatar>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="handleLogout">
                  <template #icon>
                    <div class="i-ri-logout-box-line" />
                  </template>
                  退出
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-button class="ml-4" type="primary" @click="goEditor">
            写文章
          </a-button>
        </template>
        <template v-else>
          <a-button class="ml-4" type="primary" @click="goLogin">
            登录
          </a-button>
        </template>
      </div>
    </div>
  </div>
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
}

.gradient-text {
  background-image: linear-gradient(20deg, #E21143, #FFB03A);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
}
</style>
