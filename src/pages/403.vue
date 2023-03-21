<template>
  <a-result status="403" title="403" sub-title="不好意思，这个页面你不能看！">
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
