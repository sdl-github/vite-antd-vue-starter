<route lang="yaml">
meta:
  layout: DashboardLayout
</route>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import spaceApi from '@/api/space'
import { useSpaceStore } from '@/stores/space'
const router = useRouter()
const spaceStore = useSpaceStore()
const space = computed(() => spaceStore.space)
const isInit = computed(() => space && space.value?.id)
onMounted(() => {
  spaceStore.querySpace()
})
const formRef = ref<FormInstance>()
const rules = {
  name: [{ required: true, message: '请输入初始化工作空间名称', trigger: 'blur' }],
}
const loading = ref(false)

const form = reactive({
  name: '',
})

function handleSave() {
  formRef.value?.validate()
    .then(() => {
      loading.value = true
      const { name } = unref(form)
      spaceApi.initSpace(name).then(async (res) => {
        await spaceStore.querySpace()
        message.success('初始化成功')
      }).finally(() => {
        loading.value = false
      })
    })
}

function goSpace() {
  router.push({
    path: '/post/edit',
  })
}
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full h-full flex justify-center items-center">
      <a-card class="w-400px h-200px rounded" :class="isInit ? 'h-300px' : 'h-200px'">
        <div v-if="isInit">
          <a-result
            status="成功"
            title="空间初始化成功"
            sub-title="点击开始跳转空间"
          >
            <template #extra>
              <a-button key="console" type="primary" @click="goSpace">
                开始
              </a-button>
            </template>
          </a-result>
        </div>
        <div v-else>
          <h1 class="text-xl mb-4 ">
            初始化
          </h1>
          <a-form ref="formRef" :model="form" :rules="rules">
            <a-form-item name="name">
              <a-input v-model:value="form.name" placeholder="请输入初始化工作空间名称" allow-clear />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" class="w-full" :loading="loading" @click.stop="handleSave">
                开始
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
