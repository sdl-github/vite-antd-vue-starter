<template>
  <div class='file'>
    file
  </div>
</template>

<script setup lang='ts'>
import { listBuckets } from '@/api/file';
import { onMounted, ref } from 'vue';
onMounted(() => {
  initData();
});

async function initData() {
  const res = await listBuckets()
  console.log(res);
}

const name = ref('file')
</script>
<style scoped lang='scss'>
  .file {
    position: relative;
  }
</style>
