<script lang='ts' setup>
import { computed, reactive, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '@/components/layout/Logo.vue'
import MenuItem from '@/components/layout/MenuItem.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useMenu } from '@/composables/menu'

interface IState {
  selectedKeys: string[]
  openKeys: string[]
}
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()
const { menus } = useMenu()
const state = reactive<IState>({
  selectedKeys: [],
  openKeys: [],
})
const collapsed = computed(() => appStore.collapsed)

const theme = computed(() => appStore.theme)

watchEffect(() => {
  const { path, matched } = route
  state.openKeys = matched.map(item => item.path)
  state.selectedKeys = [path]
})
</script>

<template>
  <a-layout-sider v-model:collapsed="collapsed" class="layout-sider" :trigger="null" :theme="theme" collapsible>
    <Logo />
    <a-menu v-model:selectedKeys="state.selectedKeys" v-model:openKeys="state.openKeys" mode="inline" :theme="theme">
      <MenuItem v-for="menu in menus" :key="menu.path" :menu="menu" />
    </a-menu>
  </a-layout-sider>
</template>

<style scoped lang='scss'>
.layout-sider {
  height: 100vh;
  position: sticky;
  top: 0;
}
</style>
