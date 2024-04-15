<script lang="ts">
import { message } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import { createActivity, publishActivity, updateActivity } from '~/api/activity'
import type { FormModel } from '~/pages/activity/data'
import { generateFormModel } from '~/pages/activity/data'

const state = reactive({
  form: generateFormModel(),
})
const { form } = toRefs(state)

const open = ref(false)
const loading = ref(false)
const src = ref('')
export function useModal() {
  return {
    setOpen(show: boolean) {
      open.value = show
    },
    open(source: FormModel) {
      state.form = source
      open.value = true
    },
  }
}
export default defineComponent({
  components: {},
  emits: ['ok'],
  setup(props, { emit }) {
    const router = useRouter()
    const { setOpen } = useModal()
    const saveLoading = ref(false)

    async function handleOk() {
      saveLoading.value = true
      const loading = message.loading('加载中', 0)
      try {
        const data = unref(form)
        const api = data.id ? updateActivity : createActivity
        const res = await api({
          ...data,
        })
        if ('createActivity' in res)
          form.value.id = res.createActivity?.id

        await publishActivity(form.value.id!)
        loading()
        saveLoading.value = false
        message.success('成功')
        setOpen(false)
        router.push('/activity')
        return true
      }
      catch (e) {
        loading()
        saveLoading.value = false
        return false
      }
    }

    return {
      form,
      open,
      loading,
      src,
      setOpen,
      handleOk,
    }
  },
})
</script>

<template>
  <AModal
    title="发布" ok-text="确定" cancel-text="取消" :mask-closable="false" :closable="false" :open="open" :mask="false" width="400px"
    @ok="handleOk" @cancel="setOpen(false)"
  >
    <div class="px-2 py-4">
      <template v-if="loading">
        <ASkeleton active />
      </template>

      <AForm
        :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :model="form" autocomplete="off"
        label-width="200px"
      >
        <ARow :gutter="[16, 8]">
          <ACol :span="24">
            <AFormItem label="标题" name="title">
              <AInput v-model:value="form.title" placeholder="标题" />
            </AFormItem>
          </ACol>
          <ACol :span="24">
            <AFormItem label="二级标题" name="metaTitle">
              <AInput v-model:value="form.metaTitle" placeholder="二级标题" />
            </AFormItem>
          </ACol>
          <ACol :span="24">
            <AFormItem label="简介描述" name="metaDescription">
              <ATextarea v-model:value="form.metaDescription" placeholder="简介描述" />
            </AFormItem>
          </ACol>
        </ARow>
      </AForm>
    </div>
  </AModal>
</template>

<style lang="scss"></style>
