<script setup lang="ts">
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import { message } from 'ant-design-vue'
import AvatarCropperModal, { useModal } from '@/components/ImageCropperModal.vue'

const emits = defineEmits(['back'])

const userStore = useUserStore()
const user = computed(() => userStore.user)
const avatarModal = useModal()
const loading = ref(false)
const formState = reactive({
  nickname: '',
  note: '',
})

watchEffect(() => {
  formState.nickname = user.value?.nickName || ''
})

async function onFinish() {
  // const loading = message.loading('加载中', 0)
  loading.value = true
  try {
    // await updateUserProfile(formState)
    loading.value = false
    userStore.init()
    message.success('成功')
    return true
  }
  catch (e) {
    loading.value = false
    return false
  }
}

function handleOpenAvatarCropper({ file }: UploadRequestOption) {
  const url = URL.createObjectURL(file as File)
  avatarModal.start(url)
}

async function handleUploadAvatar({ blob }: { blob: Blob }) {
  const loading = message.loading('加载中', 0)
  try {
    // const avatar = await uploadFileToS3(blob)
    // await updateUserProfile({ avatar })
    userStore.init()
    loading()
    message.success('成功')
    return true
  }
  catch (e) {
    loading()
    return false
  }
}
</script>

<template>
  <div>
    <ABreadcrumb>
      <ABreadcrumbItem href="" @click="() => emits('back')">
        账户
      </ABreadcrumbItem>
      <ABreadcrumbItem>个人资料</ABreadcrumbItem>
    </ABreadcrumb>
  </div>
  <div class="mt-4">
    <div class="my-4 text-25px font-bold">
      个人资料
    </div>
    <div>
      <AvatarCropperModal @ok="handleUploadAvatar" />
      <AUpload
        name="file"
        accept="image/png, image/jpeg"
        :show-upload-list="false"
        :custom-request="handleOpenAvatarCropper"
      >
        <div class="relative cursor-pointer">
          <AAvatar :size="72" :src="user?.avatar" :alt="user?.nickName || user?.userName">
            {{ user?.nickName || user?.userName }}
          </AAvatar>
          <div class="absolute right-[-10px] top-[50px] h-[25px] w-[25px] flex items-center justify-center rounded-[50%] bg-#e8f3ff">
            <div class="i-carbon-cloud-upload color-#1677ff" />
          </div>
        </div>
      </AUpload>
      <div class="mt-4">
        <AForm
          :model="formState"
          layout="vertical"
          autocomplete="off"
          @finish="onFinish"
        >
          <AFormItem
            label="用户名"
            name="username"
          >
            <AInput :value="user?.userName" disabled />
          </AFormItem>
          <AFormItem
            label="昵称"
            name="nickname"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <AInput v-model:value="formState.nickname" />
          </AFormItem>

          <AFormItem
            label="自我介绍"
            name="note"
          >
            <ATextarea v-model:value="formState.note" />
          </AFormItem>
          <AFormItem>
            <AButton :loading="loading" type="primary" html-type="submit">
              保存
            </AButton>
          </AFormItem>
        </AForm>
      </div>
    </div>
  </div>
</template>
