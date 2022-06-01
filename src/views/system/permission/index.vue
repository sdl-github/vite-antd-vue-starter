
<template>
    <div>
        permission
    </div>
</template>
<script setup lang="ts">
import { queryMenuTree } from '@/api/menu';
import { onMounted, reactive } from 'vue';
import { IMenu, IState } from './data';

const state = reactive<IState>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    dataList: [],
    loading: false,
    modalVisible: false,
    currentItem: {
        id: '',
        name: '',
    },
    searchParams: {

    }
});
onMounted(() => {
  initData();
});

// 初始化数据
async function initData() {
  state.loading = true;
  const res = await queryMenuTree();
  console.log(res);
  state.loading = false;
}
</script>

<style lang="scss" scoped>
</style>
