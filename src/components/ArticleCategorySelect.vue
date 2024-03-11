<script setup lang="ts">
import type { DefaultOptionType } from 'ant-design-vue/es/vc-tree-select/TreeSelect'
import useSWRV from 'swrv'
import { queryArticleCategoryTree } from '~/api/article-category'

const props = defineProps({
  value: {
    type: String,
    default: () => undefined,
  },
})
const emits = defineEmits(['update:value'])
const { data } = useSWRV('queryArticleCategory', () => queryArticleCategoryTree())
</script>

<template>
  <ATreeSelect
    :loading="!data" :value="value" show-search
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="分类" allow-clear
    tree-default-expand-all
    :tree-data="data as DefaultOptionType[]"
    tree-node-filter-prop="label"
    :field-names="{
      children: 'children',
      label: 'name',
      value: 'id',
    }"
    @change="emits('update:value', $event)"
  />
</template>
