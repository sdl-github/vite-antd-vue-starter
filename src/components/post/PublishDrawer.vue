<script setup lang="ts">
import { message } from 'ant-design-vue'
import { publishPost, unPublishPost } from '@/api/post'
import { queryTagList } from '@/api/tag'
defineProps({
  open: {
    type: Boolean,
    default: true,
  },
  post: {
    type: Object,
    default: () => {},
  },
})
const emits = defineEmits(['update:open'])
const spaceStore = useSpaceStore()
const post = computed(() => spaceStore.post)
const form = ref(generateForm())
const options = ref()
const saveLoading = ref()
const unLoading = ref(false)

onMounted(() => {
  queryTagList().then((res) => {
    if (res && res.queryTagList) {
      options.value = res.queryTagList.map((tag) => {
        const { id, name } = tag
        return { value: id, label: name }
      })
    }
  })
})

watchEffect(() => {
  console.log(post.value)
  form.value.description = post.value?.description || ''
  form.value.tagIds = post.value?.tags?.map(tag => tag?.id) || []
})

function generateForm() {
  return {
    description: '',
    tagIds: [],
  }
}
function close() {
  emits('update:open', false)
}

function save() {
  const id = unref(post)?.id as string
  const { description, tagIds } = unref(form)
  const data = {
    id, description, tagIds,
  }
  saveLoading.value = true
  publishPost(data).then((res) => {
    spaceStore.refreshPost()
    message.success('操作成功')
  }).finally(() => {
    saveLoading.value = false
  })
}

function cancelPublish() {
  unLoading.value = true
  unPublishPost(post.value?.id as string).then(() => {
    spaceStore.refreshPost()
    message.success('操作成功')
  }).finally(() => {
    unLoading.value = false
  })
}
</script>

<template>
  <a-drawer
    title="文章发布设置"
    placement="right"
    :closable="false"
    :open="open"
    @close="close"
  >
    <template v-if="post?.published" #extra>
      <a-space>
        <a-button :loading="unLoading" class="flex items-center" @click="cancelPublish">
          <div class="i-ri-eye-close-line" />
          <div class="ml-1">
            取消发布
          </div>
        </a-button>
      </a-space>
    </template>
    <a-form layout="vertical">
      <a-form-item
        label="摘要"
        name="desperation"
      >
        <a-textarea v-model:value="form.description" placeholder="请输入摘要" allow-clear />
      </a-form-item>

      <a-form-item
        label="标签"
        name="tags"
      >
        <a-select
          v-model:value="form.tagIds"
          mode="multiple"
          style="width: 100%"
          placeholder="选择标签"
          :options="options"
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-button style="margin-right: 8px" @click="close">
        取消
      </a-button>
      <a-button :loading="saveLoading" type="primary" @click="save">
        保存
      </a-button>
    </template>
  </a-drawer>
</template>
