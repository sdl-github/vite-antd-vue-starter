<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'MenuItem',
  components: {
  },
  props: {
    menu: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const router = useRouter()
    const handleClickMenu = (menu: any) => {
      const { path, component } = menu
      router.push(path)
    }
    return {
      handleClickMenu,
    }
  },
})
</script>

<template>
  <template v-if="!menu.children">
    <AMenuItem
      :key="menu.name"
      @click="handleClickMenu(menu)"
    >
      <template #icon>
        <SystemIcon :icon="menu.icon" class="h-5 w-5" />
      </template>
      <span>
        {{ menu?.title }}
      </span>
    </AMenuItem>
  </template>
  <template v-else>
    <ASubMenu :key="menu.name">
      <template #icon>
        <SystemIcon :icon="menu.icon" class="h-5 w-5" />
      </template>
      <template #title>
        {{ menu?.title }}
      </template>
      <MenuItem v-for="sub in menu.children" :key="sub.path" :menu="sub" />
    </ASubMenu>
  </template>
</template>

<style scoped lang='scss'>
</style>
