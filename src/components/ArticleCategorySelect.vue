<script setup lang="ts">
import { DefaultOptionType } from 'ant-design-vue/es/vc-tree-select/TreeSelect';
import { queryArticleCategoryTree } from '~/api/article-category';
import useSWRV from 'swrv';


const emits = defineEmits(['update:value'])
const { data } = useSWRV('queryArticleCategory', () => queryArticleCategoryTree())

const props = defineProps({
  value: {
    type: String,
    default: () => undefined
  },
})


</script>


<template>
  <ATreeSelect 
    :loading="!data" :value="value" show-search
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="分类" allow-clear
    tree-default-expand-all 
    :tree-data="data as DefaultOptionType[]" 
    tree-node-filter-prop="label"
    @change="emits('update:value', $event)"
    :field-names="{
      children: 'children',
      label: 'name',
      value: 'id',
    }">
  </ATreeSelect>
</template>