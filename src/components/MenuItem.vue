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
      const { path } = menu
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
      :key="menu.path"
      @click="handleClickMenu(menu)"
    >
      <template #icon>
        <div :class="`i-ri-${menu?.icon}`" />
      </template>
      <span>
        {{ menu?.title }}
      </span>
    </AMenuItem>
  </template>
  <template v-else>
    <ASubMenu :key="menu.path">
      <template #icon>
        <div :class="`i-ri-${menu?.icon}`" />
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
