<template>
  <a-result status="404" title="404" sub-title="这个页面飞往太空了！">
    <template #extra>
      <a-button type="primary">
        <router-link to="/">
          返回首页
        </router-link>
      </a-button>
    </template>
  </a-result>
</template>

<style>

</style>
