<script lang="ts" setup>
import type { MenuTheme } from 'ant-design-vue'

const collapsed = ref(false)
const userStore = useUserStore()
const user = computed(() => userStore.user)
const userSettingModalRef = ref()
const router = useRouter()
const title = '矿山人员感知系统'

const { menus, selectedKeys, openKeys } = useMenu()
const theme = ref<MenuTheme>('dark')

function toggle() {
  collapsed.value = !collapsed.value
}

async function handleLogout() {
  await userStore.exit()
  router.push(LOGIN_PATH)
}
</script>

<template>
  <ALayout>
    <ALayoutSider v-model:collapsed="collapsed" :trigger="null" collapsible :theme="theme">
      <div class="h-[48px] flex items-center justify-center">
        <div class="text-[30px]" />
        <div v-show="!collapsed" class="ml-2 text-sm font-bold text-white">
          {{ title }}
        </div>
      </div>
      <AMenu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" :theme="theme">
        <MenuItem v-for="menu in menus" :key="menu.path" :menu="menu" />
      </AMenu>
    </ALayoutSider>
    <ALayout>
      <div class="sticky top-0 z-999 h-[48px] flex items-center justify-between border-b bg-white px-4">
        <div class="flex items-center">
          <div
            class="cursor-pointer" :class="collapsed ? 'i-ri-menu-unfold-fill' : 'i-ri-menu-fold-fill'"
            @click="() => toggle()"
          />
        </div>
        <div>
          <ADropdown>
            <div>
              <AAvatar style="background-color: #1890ff" :src="user?.avatar">
                {{ user?.nickName || user?.userName }}
              </AAvatar>
              <span class="mx-2 rounded bg-purple-200 px-2 py-1 text-xs text-purple-500">{{ user?.nickName
                || user?.userName }}</span>
            </div>
            <template #overlay>
              <AMenu>
                <UserSettingModal ref="userSettingModalRef" />
                <AMenuItem @click="() => userSettingModalRef.start()">
                  <template #icon>
                    <div class="i-ri-user-line" />
                  </template>
                  帐户设置
                </AMenuItem>
                <AMenuItem @click="handleLogout">
                  <template #icon>
                    <div class="i-ri-logout-box-line" />
                  </template>
                  退出
                </AMenuItem>
              </AMenu>
            </template>
          </ADropdown>
        </div>
      </div>
      <ALayoutContent>
        <main class="min-h-[calc(100vh-48px)]">
          <RouterView />
        </main>
      </ALayoutContent>
    </ALayout>
  </ALayout>
</template>

<style scoped lang="scss"></style>
