<template>
    <a-modal :visible="modalVisible" :destroy-on-close="true" :title="currentItem?.id ? '编辑' : '创建'"
        :confirm-loading="confirmLoading" okText='确定' cancelText='取消' @ok="handleOk" @cancel='handleCancel'>
        <a-form ref="formRef" :model="formState.data" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
            autocomplete="off">
            <a-row :gutter="[16, 8]">
                <a-col :span="24">
                    <a-form-item label="权限名称" name="name" :rules="rules.required">
                        <a-input :placeholder="requireMessage('名称')" v-model:value="formState.data.name" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="权限标识" name="key" :rules="rules.required">
                        <a-input :placeholder="requireMessage('名称')" v-model:value="formState.data.key" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="权限等级" name="level" :rules="rules.required">
                        <a-input-number :placeholder="requireMessage('权限等级')" v-model:value="formState.data.level"
                            style="width:100%" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { FormInstance } from "ant-design-vue";
import PermissionSelect from './PermissionSelect.vue'
import { IPermission } from '../type'
const rules = {
    required: [{ required: true, message: requireMessage('必填项') }],
}
const props = defineProps({
    modalVisible: {
        type: Boolean,
        default: false,
    },
    currentItem: {
        type: Object,
        default: () => { },
    },
});


const formRef = ref<FormInstance>();

const confirmLoading = ref(false)
let formState = reactive<{ data: IPermission }>({
    data: {
        id: '',
        name: '',
        key: '',
        level: 0,
        menuIds: []
    }
});


watch(() => props.currentItem, (val, old) => {
    if (val.id) {
        const { menus, ...others } = val
        formState.data = { ...others, menuIds: menus.map((item: any) => item.id) } as IPermission
    } else {
        formState.data = {
            id: '',
            name: '',
            key: '',
            level: 0,
            menuIds: []
        }
    }
})

const emits = defineEmits(['update:modalVisible', 'handleOk'])

function requireMessage(key: string) {
    return `请输入${key}`;
}

function handleOk() {
    formRef.value?.validate().then(async (v) => {
        if (props.currentItem.id) {
            v.id = props.currentItem.id
        }
        emits('handleOk', v)
    })
}

function handleCancel() {
    emits('update:modalVisible', false)
}


</script>

<style lang="scss" scoped>
</style>
