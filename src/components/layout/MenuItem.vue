<template>
  <template v-if="!menu.children">
    <a-menu-item
      :key="menu.path"
      @click="handleClickMenu(menu)"
    >
      <template #icon>
        <div :class="`i-ri-${menu?.icon}`"></div>
      </template>
      <span>
        {{ menu?.title }}
      </span>
    </a-menu-item>
  </template>
  <template v-else>
    <a-sub-menu :key="menu.path">
      <template #icon>
        <div :class="`i-ri-${menu?.icon}`"></div>
      </template>
      <template #title>
        {{ menu?.title }}
      </template>
      <MenuItem v-for="sub in menu.children" :menu="sub" :key="sub.path" />
    </a-sub-menu>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MenuItem",
  components: {
  },
  props: {
    menu: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    const router = useRouter();
    const handleClickMenu = (menu: any) => {
      const { path } = menu;
      router.push(path);
    };
    return {
      handleClickMenu,
    };
  },
});
</script>

<style scoped lang='scss'>
</style>
