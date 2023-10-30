<script setup lang="ts">
import { message } from 'ant-design-vue'

// import { setPassword } from '@/api/user'

const emits = defineEmits(['back'])

const loading = ref(false)

const userStore = useUserStore()

const user = computed(() => userStore.user)

const rules = computed(() => {
  const obj: any = {
    newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  }
  // if (user.value?.passwordEnable)
  //   obj.oldPassword = [{ required: true, message: '请输入旧密码', trigger: 'blur' }]

  return obj
})

const formRef = ref()

const form = ref({
  oldPassword: '',
  newPassword: '',
})

function handleSave() {
  formRef.value?.validate()
    .then(async (validate: any) => {
      if (!validate)
        return
      loading.value = true
      // setPassword(form.value).then(() => {
      //   loading.value = false
      //   message.success('操作成功')
      //   emits('back')
      // }).catch(() => {
      //   loading.value = false
      // })
    })
}
</script>

<template>
  <div>
    <ABreadcrumb>
      <ABreadcrumbItem href="" @click="() => emits('back')">
        安全
      </ABreadcrumbItem>
      <ABreadcrumbItem>密码设置</ABreadcrumbItem>
    </ABreadcrumb>
  </div>
  <div class="mt-4">
    <div class="my-4 text-25px font-bold">
      更改密码
    </div>
    <AForm ref="formRef" :model="form" :rules="rules">
      <!-- <a-form-item v-if="user?.passwordEnable" name="oldPassword"> -->
      <AFormItem name="oldPassword">
        <AInputPassword v-model:value="form.oldPassword" type="password" placeholder="旧密码" allow-clear />
      </AFormItem>
      <AFormItem name="newPassword">
        <AInputPassword
          v-model:value="form.newPassword" type="password" placeholder="新密码" allow-clear
        />
      </AFormItem>
      <AFormItem>
        <AButton type="primary" :loading="loading" @click.stop="handleSave">
          保存
        </AButton>
      </AFormItem>
    </AForm>
  </div>
</template>
