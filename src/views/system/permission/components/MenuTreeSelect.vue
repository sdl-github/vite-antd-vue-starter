<script setup lang="ts">
import { queryMenuTree } from '@/api/menu';
import { onMounted, ref } from 'vue';
const props = defineProps({
    value: {
        type: String,
    },
});
const treeData = ref([]);
const emits = defineEmits(['update:value'])
onMounted(() => {
    initData();
});

async function initData() {
    const { getMenuTree } = await queryMenuTree();
    const node = [
        {
            id: "#",
            name: "根目录",
            value: "",
            children: getMenuTree,
        }
    ]
    treeData.value = node as any
}

function handleChange(value:string) {
    emits('update:value', value)
}
</script>

<template>
    <a-tree-select @change="handleChange" v-model:value="value" show-search style="width: 100%" :field-names="{
        children: 'children',
        label: 'name',
        value: 'id',
    }" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择" allow-clear :tree-data="treeData">
    </a-tree-select>
</template>