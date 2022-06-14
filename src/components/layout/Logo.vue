<template>
  <div class="flex items-center justify-center p-1">
    <img :src="logo || defaultLogo" class="w-10" />
    <h1 v-show="!collapsed" class="text-white mx-2 transition-all">{{ title }}</h1>
  </div>
</template>
<script lang="ts">
import { appStore } from "@/store/app";
import { computed, defineComponent } from "vue";
import defaultLogo from '@/assets/logo.png'

export default defineComponent({
  name: "Logo",
  setup() {
    const store = appStore();
    return {
      title: computed(() => store.title),
      logo: computed(() => store.logo),
      collapsed: computed(() => store.collapsed),
      defaultLogo,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
