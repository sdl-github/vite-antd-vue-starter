<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { IPermission } from '../type'
const props = defineProps({
  modalVisible: {
    type: Boolean,
    default: false,
  },
  currentItem: {
    type: Object,
    default: () => { },
  },
})
const emits = defineEmits(['update:modalVisible', 'handleOk'])
const rules = {
  required: [{ required: true, message: requireMessage('必填项') }],
}
const formRef = ref<FormInstance>()

const confirmLoading = ref(false)
const formState = reactive<{ data: IPermission }>({
  data: {
    id: '',
    name: '',
    key: '',
    level: 0,
    menuIds: [],
  },
})

watch(() => props.currentItem, (val, old) => {
  if (val.id) {
    const { menus, ...others } = val
    formState.data = { ...others, menuIds: menus.map((item: any) => item.id) } as IPermission
  }
  else {
    formState.data = {
      id: '',
      name: '',
      key: '',
      level: 0,
      menuIds: [],
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
    :confirm-loading="confirmLoading" ok-text="确定" cancel-text="取消" @ok="handleOk" @cancel="handleCancel"
  >
    <a-form
      ref="formRef" :model="formState.data" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <a-row :gutter="[16, 8]">
        <a-col :span="24">
          <a-form-item label="权限名称" name="name" :rules="rules.required">
            <a-input v-model:value="formState.data.name" :placeholder="requireMessage('名称')" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="权限标识" name="key" :rules="rules.required">
            <a-input v-model:value="formState.data.key" :placeholder="requireMessage('名称')" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="权限等级" name="level" :rules="rules.required">
            <a-input-number
              v-model:value="formState.data.level" :placeholder="requireMessage('权限等级')"
              style="width:100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped>
</style>
