<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import PopIconSelect from './PopIconSelect.vue'
import MenuTreeSelect from './MenuTreeSelect.vue'
import type { IMenuActionModal } from '@/views/system/permission/data'

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
})
const emits = defineEmits(['update:modalVisible', 'handleOk'])
const enum IMenuTypeEnum {
  FUN = 'FUN',
  MENU = 'MENU',
}
const formRef = ref<FormInstance>()
const rules = {
  name: [{ required: true, message: requireMessage('名称') }],
  permission: [{ required: true, message: requireMessage('权限标识') }],
  email: [{
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: '请输入正确的邮箱',
  }],
  phone: [{
    pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
    message: '请输入正确的手机号',
  }],
}
const confirmLoading = ref(false)
function genFormModel() {

}
const formState = reactive<{ data: IMenuActionModal }>({
  data: {
    id: '',
    name: '',
    title: '',
    icon: '',
    pId: '',
    orderBy: 0,
    path: '',
    component: '',
    visible: true,
    permission: '',
    type: IMenuTypeEnum.MENU,
  },
})
const validateFun = computed(() => {
  return formState.data.type === IMenuTypeEnum.FUN
})
const validateMenu = computed(() => {
  return formState.data.type === IMenuTypeEnum.MENU
})

watch(() => props.currentItem, (val, old) => {
  if (val.id) {
    formState.data = Object.assign({}, val) as IMenuActionModal
  }
  else {
    formState.data = {
      id: '',
      name: '',
      title: '',
      icon: '',
      pId: '#',
      orderBy: 0,
      path: '',
      component: '',
      visible: true,
      permission: '',
      type: IMenuTypeEnum.MENU,
    }
  }
})
function requireMessage(key: string) {
  return `请输入${key}`
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

<template>
  <a-modal
    :visible="modalVisible" :destroy-on-close="true" :title="currentItem?.id ? '编辑' : '创建'"
    :confirm-loading="confirmLoading" :width="600" ok-text="确定" cancel-text="取消" @ok="handleOk" @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="formState.data" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off">
      <a-row :gutter="[16, 8]">
        <a-col :span="12">
          <a-form-item label="类型" name="type">
            <a-radio-group v-model:value="formState.data.type" button-style="solid">
              <a-radio-button :value="IMenuTypeEnum.MENU">
                菜单
              </a-radio-button>
              <a-radio-button :value="IMenuTypeEnum.FUN">
                权限
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="名称" name="name" :rules="rules.name">
            <a-input v-model:value="formState.data.name" :placeholder="requireMessage('名称')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="标题" name="title">
            <a-input v-model:value="formState.data.title" :placeholder="requireMessage('标题')" />
          </a-form-item>
        </a-col>
        <a-col v-show="validateMenu" :span="12">
          <a-form-item label="图标" name="icon">
            <PopIconSelect v-model:value="formState.data.icon" />
          </a-form-item>
        </a-col>
        <a-col v-show="validateFun" :span="12">
          <a-form-item label="权限标识" name="permission" :rules="validateFun ? rules.permission : []">
            <a-input v-model:value="formState.data.permission" :placeholder="requireMessage('权限标识')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="组件" name="component">
            <a-input v-model:value="formState.data.component" :placeholder="requireMessage('组件')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上级目录" name="pId">
            <MenuTreeSelect v-model:value="formState.data.pId" />
          </a-form-item>
        </a-col>
        <a-col v-show="validateMenu" :span="12">
          <a-form-item label="菜单排序" name="orderBy">
            <a-input-number
              v-model:value="formState.data.orderBy" :placeholder="requireMessage('名称')"
              style="width:100%"
            />
          </a-form-item>
        </a-col>
        <a-col v-show="validateMenu" :span="12">
          <a-form-item label="菜单路径" name="path">
            <a-input v-model:value="formState.data.path" :placeholder="requireMessage('名称')" />
          </a-form-item>
        </a-col>
        <a-col v-show="validateMenu" :span="12">
          <a-form-item label="是否可见" name="visible">
            <a-radio-group v-model:value="formState.data.visible">
              <a-radio :value="true">
                是
              </a-radio>
              <a-radio :value="false">
                否
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped></style>
