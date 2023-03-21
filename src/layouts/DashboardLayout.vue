<template>
  <a-layout class="layout">
    <SideMenu />
    <a-layout class="layout-main">
      <Header />
      <Content />
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import Header from "@/components/layout/Header.vue";
import SideMenu from "@/components/layout/SideMenu.vue";
import Content from "@/components/layout/Content.vue";
import Logo from "@/components/layout/Logo.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: 'DashBoardLayout',
  components: {
    Header,
    Logo,
    SideMenu,
    Content,
  },
  setup() {
 
  },
});
</script>

<style scoped lang="scss">
.layout {
  width: 100%;
  layout-main {
  }
}
</style>
