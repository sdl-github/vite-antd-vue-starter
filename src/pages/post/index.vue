<route lang="yaml">
meta:
  layout: PostLayout
</route>

<script setup lang="ts">
</script>

<template>
  <div class="min-h-100vh  flex justify-center">
      <div class="flex flex-col m-2">
          <PostItem v-for="item in 10" :key="item"/>
      </div>
  </div>
</template>

<style lang="scss" scoped></style>
