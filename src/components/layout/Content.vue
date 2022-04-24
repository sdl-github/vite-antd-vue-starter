<template>
  <a-layout-content class="content">
    <router-view />
  </a-layout-content>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Main",
});
</script>

<style lang="scss" scoped>
.content {
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  position: relative;
  overflow: auto;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.2s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
