<script setup lang="ts">
import { reactive, ref, toRefs, unref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import useSWRV from 'swrv'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import {  ReservationStatusList,generateFormModel } from '../data'
import type { FormModel, Reservation } from '../data'
import type { GeoCode } from '~/api/reservation'
import { createReservation, queryGeoByAddress, updateReservation } from '~/api/reservation'
import { queryUserList } from '~/api/user'
import { DefaultRoleEnum } from '~/utils/graphql/zeus'
import { upload } from '~/api/file'

interface Props {
  open: boolean
  currentItem: Reservation | null
}
const props = withDefaults(defineProps<Props>(), {
  modelVisible: false,
  currentItem: null,
})

const emits = defineEmits(['update:open', 'ok', 'cancel'])

const { data } = useSWRV('queryUserList/', () => queryUserList(DefaultRoleEnum.ORG_HEAD))

const userListOptions = computed(() => {
  return data.value?.map((item) => {
    return {
      label: item.nickName || item.userName,
      value: item.id,
    }
  })
})

const searchLoading = ref(false)
const searchAddressOption = ref<(GeoCode & { label: string;value: string })[]>([])
const formRef = ref<FormInstance>()

const rules = {
  status: [{ required: true, message: '必填项' }],
}

const confirmLoading = ref(false)
const state = reactive<{ model: FormModel }>({
  model: generateFormModel(),
})

const { model } = toRefs(state)

watchEffect(() => {
  if (!props.open)
    state.model = generateFormModel()

  if (props.open && props.currentItem && props.currentItem.id)
    state.model = Object.assign({}, props.currentItem)
})

function handleOk() {
  formRef.value?.validate().then(async (v) => {
    if (v) {
      console.log(v.status);
      const data = Object.assign({}, unref(model))
      const api = data.id ? updateReservation : createReservation
      confirmLoading.value = true
      const data2 = {"id":data.id,"status":data.status};
      api(data2).then(() => {
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

async function handleUpload(e: UploadRequestOption) {
  const { file } = e
  const loading = message.loading('加载中', 0)
  try {
    const res = await upload(file, 'org')
    model.value.logo = res.url
    loading()
    return true
  }
  catch (e) {
    loading()
    return false
  }
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
          <AFormItem label="狀態" name="status" :rules="rules.status">
            <ASelect
              v-model:value="model.status" placeholder="请选择"
            >
              <ASelectOption value="0">
                已预约
              </ASelectOption>
              <ASelectOption value="1">
                已完成
              </ASelectOption>
              </ASelect>
          </AFormItem>
        </ACol>
      </ARow>
    </AForm>
  </AModal>
</template>

<style lang="scss" scoped></style>
