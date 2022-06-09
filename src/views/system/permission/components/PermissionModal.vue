<template>
  <a-modal v-model:visible="modalVisible" :destroy-on-close="true" :title="currentItem?.id ? '编辑' : '创建'"
    :confirm-loading="confirmLoading" :width="600" okText='确定' cancelText='取消' @ok="handleOk" @cancel='handleCancel'>
    <a-form ref="formRef" :model="formState.data" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
      autocomplete="off">
      <a-row :gutter="[16, 8]">
        <a-col :span="12">
          <a-form-item label="类型" name="type">
            <a-radio-group v-model:value="formState.data.type" button-style="solid">
              <a-radio-button :value="IMenuTypeEnum.MENU">菜单</a-radio-button>
              <a-radio-button :value="IMenuTypeEnum.FUN">功能</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="名称" name="name" :rules="rules.name">
            <a-input :placeholder="requireMessage('名称')" v-model:value="formState.data.name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="图标" name="icon">
            <PopIconSelect v-model:value="formState.data.icon"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="权限标识" name="permission">
            <a-input :placeholder="requireMessage('名称')" v-model:value="formState.data.permission" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上级目录" name="pId">
            <a-input :placeholder="requireMessage('名称')" v-model:value="formState.data.pId" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单排序" name="orderBy">
            <a-input :placeholder="requireMessage('名称')" v-model:value="formState.data.orderBy" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单路径" name="path">
            <a-input :placeholder="requireMessage('名称')" v-model:value="formState.data.path" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否可见" name="visible">
            <a-input :placeholder="requireMessage('名称')" v-model:value="formState.data.visible" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { FormInstance } from "ant-design-vue";
import { IMenuActionModal } from '@/views/system/permission/data';
import PopIconSelect from './PopIconSelect.vue';

const enum IMenuTypeEnum {
  FUN = "FUN",
  MENU = "MENU",
}
const props = defineProps({
  modalVisible: {
    type: Boolean,
    default: false,
  },
  currentItem: {
    type: Object,
    default: () => {
    },
  },
});

const formRef = ref<FormInstance>();
const rules = {
  name: [{ required: true, message: requireMessage('名称') }],
  password: [{ required: true, message: requireMessage('密码') }],
  email: [{
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: "请输入正确的邮箱",
  }],
  phone: [{
    pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
    message: "请输入正确的手机号",
  }]
}
const confirmLoading = ref(false)
let formState = reactive<{ data: IMenuActionModal }>({
  data: {
    id: '',
    name: '',
    icon: '',
    pId: '',
    orderBy: 0,
    path: '',
    component: '',
    visible: true,
    permission: '',
    type: IMenuTypeEnum.MENU,
  }
});

watch(() => props.currentItem, (val, old) => {
  if (val.id) {

  } else {

  }
})
const emits = defineEmits(['update:modalVisible', 'handleOk'])

function requireMessage(key: string) {
  return `请输入${key}`;
}

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (props.currentItem.id) {
      delete v.username;
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
