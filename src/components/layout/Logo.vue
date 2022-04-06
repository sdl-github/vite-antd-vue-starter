<template>
  <div class="logo">
    <img :src="logo || defaultLogo" class="sidebar-logo" />
    <h1 class="sidebar-title">{{ title }}</h1>
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
      defaultLogo,
    };
  },
});
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;

  .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }

  .sidebar-title {
    margin-left: 12px;
    display: inline-block;
    color: #fff;
    font-weight: 500;
    line-height: 50px;
    font-size: 16px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
  }
}
</style>
