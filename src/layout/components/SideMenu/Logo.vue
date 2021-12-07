
<template>
  <div class="logo">
    <transition name="side-bar-fade">
      <div>
        <img :src="logo" class="sidebar-logo" />
        <h1 v-if="!collapsed" class="sidebar-title">{{ name }}</h1>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { appStore } from "@/store/app";
import { computed, defineComponent } from "vue";
export default defineComponent({
  name: "Logo",
  setup() {
    const store = appStore();
    return {
      name: computed(() => store.title),
      logo: computed(() => store.logo),
      collapsed: computed(() => store.collapsed),
      theme: computed(() => store.theme),
    };
  },
});
</script>

<style lang="scss" scoped>
.side-bar-fade-active {
  transition: opacity 1.5s;
}

.side-bar-fade-enter,
.side-bar-fade-leave-to {
  opacity: 0;
}
.logo {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #001629;
  text-align: center;
  & .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 12px;
  }

  & .sidebar-title {
    display: inline-block;
    margin: 0;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
  }
}
</style>
