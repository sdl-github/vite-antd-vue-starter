<script setup lang="ts">
import { reactive, ref, toRefs, unref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { OrgTypeList, generateFormModel } from '../data'
import type { CreateOrgInput, FormModel, Org, UpdateOrgInput } from '../data'
import type { GeoCode } from '~/api/org'
import { createOrg, queryGeoByAddress, updateOrg } from '~/api/org'

interface Props {
  open: boolean
  currentItem: Org | null
}
const props = withDefaults(defineProps<Props>(), {
  modelVisible: false,
  currentItem: null,
})

const emits = defineEmits(['update:open', 'ok', 'cancel'])
const searchLoading = ref(false)
const searchAddressOption = ref<(GeoCode & { label: string;value: string })[]>([])
const formRef = ref<FormInstance>()

const rules = {
  name: [{ required: true, message: '必填项' }],
  orgType: [{ required: true, message: '必填项' }],
  address: [{ required: true, message: '必填项' }],
}

const confirmLoading = ref(false)
const state = reactive<{ model: FormModel }>({
  model: generateFormModel(),
})

const { model } = toRefs(state)

watch(() => props.currentItem, (val) => {
  if (val?.id)
    state.model = val as FormModel
})

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (v) {
      const data = Object.assign({}, unref(model))
      const api = data.id ? updateOrg : createOrg
      confirmLoading.value = true
      api(data).then(() => {
        confirmLoading.value = false
        message.success('操作成功')
        emits('ok')
        handleCancel()
      }).catch(() => {
        confirmLoading.value = false
      })
    }
  })
}

function handleCancel() {
  state.model = generateFormModel()
  confirmLoading.value = false
  emits('update:open', false)
  emits('cancel')
}

const search = useDebounceFn(async (val: string) => {
  searchLoading.value = true
  const res = await queryGeoByAddress(val)
  if (res.geocodes && res.geocodes.length) {
    searchAddressOption.value = res.geocodes.map((item) => {
      const { formatted_address } = item
      const label = formatted_address
      return {
        ...item,
        label,
        value: label,
      }
    })
  }
  else { searchAddressOption.value = [] }
  searchLoading.value = false
}, 1000)

async function handleSearch(val: string) {
  if (!val)
    return
  searchLoading.value = true
  search(val)
}

function handleChange(val: any, option: GeoCode) {
  // 经度，纬度
  const { location } = option
  const [longitude, latitude] = location.split(',').map(Number)
  model.value.longitude = longitude
  model.value.latitude = latitude
}
</script>

<template>
  <AModal
    :open="open" :destroy-on-close="true" :title="currentItem?.id ? '编辑' : ' 创建'"
    :confirm-loading="confirmLoading" :width="600" ok-text="确定" cancel-text="取消" @ok="handleOk"
    @cancel="handleCancel"
  >
    <AForm
      ref="formRef" class="mt-5" :model="model" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }"
      autocomplete="off"
    >
      <ARow :gutter="[16, 8]">
        <ACol :span="12">
          <AFormItem label="名称" name="name" :rules="rules.name">
            <AInput v-model:value="model.name" placeholder="名称" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="类型" name="orgType" :rules="rules.orgType">
            <ASelect v-model:value="model.orgType" placeholder="请选择" :options="OrgTypeList" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="营业时间" name="openTime">
            <AInput v-model:value="model.openTime" placeholder="营业时间" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="负责人" name="leadId">
            <AInput v-model:value="model.leadId" placeholder="负责人" />
          </AFormItem>
        </ACol>
        <ACol :span="24">
          <AFormItem label="地址" name="address" :rules="rules.address" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
            <ASelect
              v-model:value="model.address"
              :filter-option="false"
              :default-active-first-option="false"
              show-search
              :not-found-content="undefined"
              placeholder="请选择"
              :options="searchAddressOption"
              @search="handleSearch"
              @change="handleChange"
            />
            <template #notFoundContent>
              <ASpin size="small" />
            </template>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<style lang="scss" scoped></style>
