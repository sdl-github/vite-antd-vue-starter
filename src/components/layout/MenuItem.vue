<template>
  <a-menu-item
    v-if="!menu.children"
    :key="menu.path"
    @click="handleClickMenu(menu)"
  >
    <template #icon>
      <RemixIcon :icon="menu.meta.icon" />
    </template>
    <span>
      {{ menu.meta.title }}
    </span>
  </a-menu-item>
  <a-sub-menu v-else :key="menu.path">
    <template #icon>
      <RemixIcon :icon="menu.meta.icon" />
    </template>
    <template #title>
      {{ menu.meta.title }}
    </template>
    <MenuItem v-for="sub in menu.children" :menu="sub" :key="sub.path" />
  </a-sub-menu>
</template>

<script lang="ts">
import RemixIcon from "@/components/RemixIcon.vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MenuItem",
  components: {
    RemixIcon,
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
      RemixIcon,
      handleClickMenu,
    };
  },
});
</script>

<style scoped lang='scss'>
</style>
