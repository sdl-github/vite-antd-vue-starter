<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { reactive, ref, watch } from 'vue'
import type { Menu, MenuCreateInput, MenuUpdateInput } from '../data'
import MenuSelect from './MenuSelect.vue'
import { MenuTypeEnum } from '@/utils/graphql/zeus'
import { createMenu, updateMenu } from '@/api/menu'

type ModelType = (MenuCreateInput & MenuUpdateInput)

interface Props {
  open: boolean
  currentItem: Menu | null
}
const props = withDefaults(defineProps<Props>(), {
  modelVisible: false,
  currentItem: null,
})

const emits = defineEmits(['update:open', 'ok', 'cancel'])

function generateModel(): ModelType {
  return {
    id: '',
    title: '',
    icon: '',
    parentId: '0',
    name: '',
    path: '',
    sort: 0,
    visible: true,
    type: MenuTypeEnum.MENU,
  }
}

const formRef = ref<FormInstance>()

const rules = {
  required: [{ required: true, message: '请输入' }],
}

const confirmLoading = ref(false)
const state = reactive({
  model: generateModel(),
})

const { model } = toRefs(state)

watch(() => props.open, (val) => {
  if (val) {
    state.model = { ...generateModel(), ...props.currentItem }
  }
})

function requireMessage(key: string) {
  return `请输入${key}`
}

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (v) {
      const data = Object.assign({}, unref(model))
      const { id, title, name, type = MenuTypeEnum.MENU, icon, parentId, path, sort, visible } = data
      const createInput: MenuCreateInput = {
        title, name, icon, type, parentId, path, sort, visible,
      }
      const updateInput: MenuUpdateInput = {
        id, title, name, type, icon, parentId, path, sort, visible,
      }
      const api = data.id ? updateMenu : createMenu
      const input = (data.id ? updateInput : createInput) as ModelType
      confirmLoading.value = true
      api(input).then((res) => {
        confirmLoading.value = false
        message.success('操作成功')
        emits('ok')
        handleCancel()
      }).catch((e) => {
        confirmLoading.value = false
      })
    }
  })
}

function handleCancel() {
  state.model = generateModel()
  confirmLoading.value = false
  emits('update:open', false)
  emits('cancel')
}
</script>

<template>
  <a-modal
    :open="open" :destroy-on-close="true" :title="currentItem?.id ? '编辑' : ' 创建'" :confirm-loading="confirmLoading"
    :width="600" ok-text="确定" cancel-text="取消" @ok="handleOk" @cancel="handleCancel"
  >
    <a-form
      ref="formRef" class="mt-5" :model="model" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <a-row :gutter="[16, 8]">
        <a-col :span="12">
          <a-form-item label="类型" name="type">
            <a-radio-group v-model:value="model.type" button-style="solid">
              <a-radio-button :value="MenuTypeEnum.MENU">
                菜单
              </a-radio-button>
              <a-radio-button :value="MenuTypeEnum.PERMISSION">
                权限
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="标题" name="title" :rules="rules.required">
            <a-input v-model:value="model.title" :placeholder="requireMessage('标题')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="标识" name="name" :rules="rules.required">
            <a-input v-model:value="model.name" :placeholder="requireMessage('标识')" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上级目录" name="parentId">
            <MenuSelect v-model:value="model.parentId" />
          </a-form-item>
        </a-col>
        <template v-if="model.type === MenuTypeEnum.MENU">
          <a-col :span="12">
            <a-form-item label="图标" name="icon">
              <a-input v-model:value="model.icon" :placeholder="requireMessage('图标')" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="路由" name="path">
              <a-input v-model:value="model.path" :placeholder="requireMessage('路由')" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="排序" name="order">
              <a-input-number v-model:value="model.sort" class="w-full" :placeholder="requireMessage('排序')" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否可见" name="visible">
              <a-checkbox v-model:checked="model.visible" class="w-full" />
            </a-form-item>
          </a-col>
        </template>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped></style>
