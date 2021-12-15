<template>
  <a-menu-item class="menu-item" :key="item.path" @click="handleGoMenu">
    <span class="anticon">
      <RemixIcon :icon="item?.meta?.icon" />
    </span>
    <span>
      {{ item?.meta?.title }}
    </span>
  </a-menu-item>
</template>

<script lang="ts">
import RemixIcon from "@/components/RemixIcon.vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

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
    const router = useRouter();
    const handleGoMenu = () => {
      const { item } = props;
      const name = (item.children && item.children[0].name) || item.name;
      router.push({ name });
    };
    return {
      RemixIcon,
      handleGoMenu,
    };
  },
});
</script>

<style scoped lang='scss'>
</style>
