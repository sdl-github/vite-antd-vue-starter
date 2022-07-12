<template>
  <a-skeleton active :loading="state.loading"/>
</template>

<script setup lang='ts'>
import { onMounted, reactive } from 'vue';
onMounted(() => {
  initData();
});

const state = reactive({
  loading: false
})

async function initData() {
  state.loading = true
  state.loading = false
}

</script>
<style scoped lang='scss'>
</style>
