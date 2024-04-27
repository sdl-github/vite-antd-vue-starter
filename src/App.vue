<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale(zhCN.locale)
</script>

<template>
  <AConfigProvider :locale="zhCN">
    <RouterView />
  </AConfigProvider>
</template>
