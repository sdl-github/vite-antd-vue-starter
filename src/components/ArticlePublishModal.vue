<script lang="ts">
import { message } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import { publishArticle, updateArticle } from '~/api/article'
import { FormModel, generateFormModel } from '~/pages/article/data'

const state = reactive({
  form: generateFormModel()
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
        await updateArticle({
          ...data
        })
        await publishArticle(form.value.id!)
        loading()
        saveLoading.value = false
        message.success('成功')
        setOpen(false)
        router.push('/article')
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
  <AModal title="发布" ok-text="确定" cancel-text="取消" :closable="false" :open="open" :mask="false" width="400px"
    @ok="handleOk" @cancel="setOpen(false)">
    <div class="py-4 px-2">
      <template v-if="loading">
        <ASkeleton active />
      </template>

      <AForm :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" ref="formRef" :model="form" autocomplete="off"
        label-width="200px">
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
          <ACol :span="24">
            <AFormItem label="分类" name="categoryId">
              <ArticleCategorySelect v-model:value="form.categoryId" class="w-200px" />
            </AFormItem>
          </ACol>
        </ARow>
      </AForm>
    </div>
  </AModal>
</template>

<style lang="scss"></style>
