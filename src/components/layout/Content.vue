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
  position: relative;
  overflow: auto;
}
</style>
