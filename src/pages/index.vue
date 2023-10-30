<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="tsx">

</script>

<template>
  <div>
    dashboard
    <AButton v-if="checkPermission(['PERMISSION_TEST', 'SUPER_ADMIN'])">
      权限测试: PERMISSION_TEST
    </AButton>
    <AButton v-if="checkPermission(['PERMISSION_TEST_2'])">
      权限测试2: PERMISSION_TEST_2
    </AButton>
  </div>
</template>

  <style lang="scss" scoped></style>
