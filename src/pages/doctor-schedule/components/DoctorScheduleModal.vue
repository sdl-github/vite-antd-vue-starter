<script setup lang="ts">
import { reactive, ref, toRefs, unref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import useSWRV from 'swrv'
import { generateFormModel } from '../data'
import type { DoctorSchedule, FormModel } from '../data'
import { queryOrgPage } from '~/api/org'
import { queryUserPage } from '~/api/user'
import { createDoctorSchedule, updateDoctorSchedule } from '~/api/doctor-schedule'

interface Props {
  open: boolean
  currentItem: DoctorSchedule | null
}
const props = withDefaults(defineProps<Props>(), {
  modelVisible: false,
  currentItem: null,
})
const emits = defineEmits(['update:open', 'ok', 'cancel'])

const formRef = ref<FormInstance>()

const rules = {
  orgId: [{ required: true, message: '必填项' }],
  doctorId: [{ required: true, message: '必填项' }],
  date: [{ required: true, message: '必填项' }],
  shift: [{ required: true, message: '必填项' }],
}

const confirmLoading = ref(false)
const state = reactive<{ model: FormModel }>({
  model: generateFormModel(),
})

const { model } = toRefs(state)
const { data: orgRes } = useSWRV(`queryOrgPage`, () => queryOrgPage({
  pageNo: 1,
  pageSize: 999,
  sort: '',
}))

const orgOptions = computed(() => {
  return orgRes.value?.queryOrgPage?.content?.map((item) => {
    return {
      label: item.name,
      value: item.id,
    }
  })
})
const { data: userRes } = useSWRV(() => model.value.orgId && `queryDoctorPage/${model.value.orgId}` || null, () => queryUserPage({
  pageNo: 1,
  pageSize: 999,
  sort: '',
  orgId: model.value.orgId,
}))

const userListOptions = computed(() => {
  return userRes.value?.queryUserPage?.content?.map((item) => {
    return {
      label: item.nickName || item.userName,
      value: item.id,
    }
  })
})

watchEffect(() => {
  if (!props.open)
    state.model = generateFormModel()

  if (props.open && props.currentItem && props.currentItem.id)
    state.model = Object.assign({}, props.currentItem)
})

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (v) {
      const data = Object.assign({}, unref(model))
      const api = data.id ? updateDoctorSchedule : createDoctorSchedule
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
          <AFormItem label="机构" name="orgId" :rules="rules.orgId">
            <ASelect v-model:value="model.orgId" placeholder="请选择" :options="orgOptions" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="医生" name="doctorId" :rules="rules.doctorId">
            <ASelect v-model:value="model.doctorId" placeholder="请选择" :options="userListOptions" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="日期" name="date" :rules="rules.date">
            <ADatePicker v-model:value="model.date" value-format="YYYY-MM-DD" placeholder="日期" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="班次" name="shift" :rules="rules.shift">
            <ASelect
              v-model:value="model.shift"
            >
              <ASelectOption value="上午">
                上午
              </ASelectOption>
              <ASelectOption value="下午">
                下午
              </ASelectOption>
            </ASelect>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<style lang="scss" scoped></style>
