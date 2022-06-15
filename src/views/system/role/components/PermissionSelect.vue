<script setup lang="ts">
import { queryMenuTree } from '@/api/menu';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { message, TreeSelect } from 'ant-design-vue';
const fileName = {
    children: 'children',
    title: 'name',
    key: 'id',
}
const props = defineProps({
    currentRole: {
        type: Object,
        default: () => {},
    },
});
const treeData = ref([]);
const checkedKeys = ref([]);
const checkPermissionKeys = ref([]);
const emits = defineEmits(['handleSave'])

watchEffect(()=>{
    const ids = props?.currentRole?.menus?.map(item => item.id);
    checkedKeys.value = ids;
    checkPermissionKeys.value = ids;
})

onMounted(() => {
    initData();
});

async function initData() {
    const { getMenuTree } = await queryMenuTree();
    treeData.value = getMenuTree as any
}

function handleCheck(checkedKeys, e) {
    console.log(checkedKeys);
    console.log(e);
    const { halfCheckedKeys } = e
    checkPermissionKeys.value = [...checkedKeys, ...halfCheckedKeys]
}

function handleSave() {
    if(!props.currentRole.id){
        message.info('请先选择角色')
        return
    }
    emits('handleSave', {
        id: props.currentRole.id,
        menuIds: checkPermissionKeys.value
    })
}
</script>

<template>
    <a-card class="permission_card" title="权限配置">
        <template #extra>
            <a-button @click="handleSave" type="primary">保存</a-button>
        </template>
        <a-tree @check="handleCheck" v-model:checkedKeys="checkedKeys" :tree-data="treeData" :field-names="fileName"
            :showCheckedStrategy="TreeSelect.SHOW_ALL" checkable  style="width: 100%"
            allow-clear>
        </a-tree>
    </a-card>
</template>

<style lang="scss" scoped>
.permission_card {
    width: 100%;
    min-width: 300px;
    height: 600px;
    overflow: auto;
    margin-left: 24px;
}
</style>