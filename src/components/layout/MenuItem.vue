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
      default: {},
    },
  },
  setup(props) {
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
    <a-menu-item
      :key="menu.path"
      @click="handleClickMenu(menu)"
    >
      <template #icon>
        <div :class="`i-ri-${menu?.icon}`" />
      </template>
      <span>
        {{ menu?.title }}
      </span>
    </a-menu-item>
  </template>
  <template v-else>
    <a-sub-menu :key="menu.path">
      <template #icon>
        <div :class="`i-ri-${menu?.icon}`" />
      </template>
      <template #title>
        {{ menu?.title }}
      </template>
      <MenuItem v-for="sub in menu.children" :key="sub.path" :menu="sub" />
    </a-sub-menu>
  </template>
</template>

<style scoped lang='scss'>
</style>
