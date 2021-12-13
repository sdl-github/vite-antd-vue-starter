<template>
  <a-menu-item class="menu-item" :key="item.path">
    <span class="anticon">
      <RemixIcon :icon="item?.meta?.icon" />
    </span>
    <router-link
      :to="{ name: (item.children && item.children[0].name) || item.name }"
    >
      <span>{{ item?.meta?.title }}</span>
    </router-link>
  </a-menu-item>
</template>

<script lang="ts">
import RemixIcon from "@/components/RemixIcon.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    RemixIcon,
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    return {
      RemixIcon,
    };
  },
});
</script>

<style scoped lang='scss'>
</style>
