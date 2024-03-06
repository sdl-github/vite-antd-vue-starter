<script setup lang="ts">
import { reactive, ref, toRefs, unref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import useSWRV from 'swrv'
import { generateFormModel } from '../data'
import type { FormModel, PhysicalExam } from '../data'
import { queryOrgPage } from '~/api/org'
import { queryUserPage } from '~/api/user'
import { DefaultRoleEnum } from '~/utils/graphql/zeus'
import { createPhysicalExam, updatePhysicalExam } from '~/api/physical-exam'

interface Props {
  open: boolean
  currentItem: PhysicalExam | null
}
const props = withDefaults(defineProps<Props>(), {
  modelVisible: false,
  currentItem: null,
})
const emits = defineEmits(['update:open', 'ok', 'cancel'])

const formRef = ref<FormInstance>()

const rules = {
  orgId: [{ required: true, message: '必填项' }],
  userId: [{ required: true, message: '必填项' }],
  date: [{ required: true, message: '必填项' }],
  required: [{ required: true, message: '必填项' }],
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
const { data: userRes } = useSWRV(() => `queryUserPage/${model.value.orgId}`, () => queryUserPage({
  pageNo: 1,
  pageSize: 999,
  sort: '',
  roleKey: DefaultRoleEnum.USER,
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
      const api = createPhysicalExam
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
    :confirm-loading="confirmLoading" :width="800" ok-text="确定" cancel-text="取消" @ok="handleOk"
    @cancel="handleCancel"
  >
    <AForm
      ref="formRef" class="mt-5" :model="model" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }"
      autocomplete="off"
    >
      <ARow :gutter="[16, 8]">
        <ACol :span="12">
          <AFormItem label="机构" name="orgId" :rules="rules.orgId">
            <ASelect v-model:value="model.orgId" placeholder="请选择" :options="orgOptions" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="姓名" name="userId" :rules="rules.userId">
            <ASelect v-model:value="model.userId" placeholder="请选择" :options="userListOptions" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="日期" name="date" :rules="rules.date">
            <ADatePicker v-model:value="model.date" value-format="YYYY-MM-DD" placeholder="日期" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="身高" name="height" :rules="rules.required">
            <AInputNumber v-model:value="model.height" placeholder="身高" style="width:100%" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="体重" name="weight" :rules="rules.required">
            <AInputNumber v-model:value="model.weight" placeholder="体重" style="width:100%" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="血压" name="bloodPressure" :rules="rules.required">
            <AInput v-model:value="model.bloodPressure" placeholder="血压" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="心率" name="heartRate" :rules="rules.required">
            <AInputNumber v-model:value="model.heartRate" placeholder="心率" style="width:100%" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="胆固醇水平" name="cholesterolLevel" :rules="rules.required">
            <AInputNumber v-model:value="model.cholesterolLevel" placeholder="胆固醇水平" style="width:100%" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="血糖水平" name="sugarLevel" :rules="rules.required">
            <AInputNumber v-model:value="model.sugarLevel" placeholder="血糖水平" style="width:100%" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="检查结果/建议" name="result" :rules="rules.required">
            <ATextarea v-model:value="model.result" placeholder="检查结果" />
          </AFormItem>
        </ACol>
        <ACol :span="12">
          <AFormItem label="备注" name="doctorNotes" :rules="rules.required">
            <ATextarea v-model:value="model.doctorNotes" placeholder="备注" />
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<style lang="scss" scoped></style>
