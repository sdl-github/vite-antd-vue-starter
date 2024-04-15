<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="ts">
import useSWRV from 'swrv'
import { message } from 'ant-design-vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import { queryMessagePage, queryMessageSessionPage, queryOpenChat, sendMessage, setOpenChat } from '@/api/chat'
import { MessageTypeEnum } from '~/utils/graphql/zeus'
import type { ModelTypes, ValueTypes } from '~/utils/graphql/zeus'
import { upload } from '~/api/file'

const messageContentRef = ref()
const userStore = useUserStore()
const user = computed(() => userStore.user)
const { data: openChat, mutate: mutateQueryOpenChat } = useSWRV(user.value?.id ? `queryOpenChat/${user.value?.id}` : null, () => queryOpenChat(user.value!.id!))
const { data, mutate } = useSWRV(`queryOrgPage`, () => queryMessageSessionPage({
  pageNo: 1,
  pageSize: 10,
}))

let timer: NodeJS.Timer | null = null
const content = ref('')
const current = ref(0)

mutate()

const sessionList = computed(() => {
  const userId = user.value?.id as string
  return data.value?.queryMessageSessionPage?.content?.map((item) => {
    const { id: sessionId, fromUserId, fromUser, toUserId, toUser } = item
    const userObj = {
      [fromUserId!]: toUser,
      [toUserId!]: fromUser,
    }
    return { ...userObj[userId], sessionId }
  })
})
const hasNext = ref(true)

const currentSession = computed<ModelTypes['User'] & { sessionId?: string }>(() => sessionList.value && sessionList.value[current.value] || {})
const params = reactive<ModelTypes['QueryMessagePageSpecificationInput']>({
  pageNo: 0,
  pageSize: 999,
})
const messageList = ref<(ModelTypes['Message'] & {
  isMe?: boolean
  info?: ModelTypes['User']
})[]>([])

async function loadMoreData($state?: any) {
  if (!hasNext.value) {
    $state && $state.complete()
    return
  }
  (params.pageNo = params.pageNo + 1)
  const list = await getMessageData()
  try {
    messageList.value = [...list!]
    messageContentRef.value && (messageContentRef.value.scrollTop = messageContentRef.value.scrollHeight)
    $state && $state.loaded()
    if (!hasNext.value)
      $state && $state.complete()
  }
  catch (e) {
    $state && $state.error()
  }
}

async function getMessageData() {
  const res = await queryMessagePage({ ...params, sessionId: currentSession.value.sessionId })!
  const { content, hasNext: hasNextPage } = res.queryMessagePage!
  const data = content?.map((item) => {
    const isMe = item.fromUserId === user.value?.id
    const info = isMe ? item.fromUser :  item.fromUser
    return { ...item, isMe, info }
  })
  hasNext.value = !!hasNextPage
  return data
}

onMounted(async () => {
  await loadMoreData()
  scrollToBottom()
  setTimeout(() => {
    handleSetTimeout()
  }, 500)
})

onBeforeRouteLeave(() => {
  handleClearTimeout()
})

function handleSetTimeout() {
  timer = setInterval(async () => {
    const list = await getMessageData()
    messageList.value = [...list!]
  }, 5000)
}

function handleClearTimeout() {
  timer && clearTimeout(timer)
  timer = null
}

async function handleSetSession(item: ModelTypes['Message'], index: number) {
  current.value = index
  messageList.value = []
  const list = await getMessageData()
  messageList.value = [...list!]
  handleClearTimeout()
  handleSetTimeout()
  scrollToBottom()
}

async function handleSend(type: MessageTypeEnum, value: string) {
  if (!value) {
    message.warning('请输入内容')
    return
  }
  const loading = message.loading('加载中', 0)
  try {
    const input: ValueTypes['SendMessageInputInput'] = {
      content: value,
      toUserId: currentSession.value.id,
      sessionId: currentSession.value.sessionId,
      type,
    }
    await sendMessage(input)
    await loading()
    const list = await getMessageData()
    messageList.value = [...list!]
    content.value = ''
    scrollToBottom()
    // message.success('成功')
    return true
  }
  catch (e) {
    loading()
    return false
  }
}

function scrollToBottom() {
  nextTick(() => {
    messageContentRef.value && (messageContentRef.value.scrollTop = messageContentRef.value.scrollHeight)
  })
}

async function handleUpload(e: UploadRequestOption) {
  const { file } = e
  const loading = message.loading('加载中', 0)
  try {
    const res = await upload(file, 'message')
    loading()
    await handleSend(MessageTypeEnum.IMAGE, res.url!)
    return true
  }
  catch (e) {
    loading()
    return false
  }
}
async function handleChangeOpenChat() {
  const loading = message.loading('加载中', 0)
  try {
    await setOpenChat(user.value!.id!, !openChat.value?.userOpenMessage)
    await mutateQueryOpenChat()
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
  <div class="m-4 h-90% flex border rounded-10px bg-white">
    <div class="my-2 ml-2">
      线上问诊
      <ASwitch :checked="openChat?.userOpenMessage" @click="handleChangeOpenChat" />
    </div>
    <template v-if="openChat?.userOpenMessage">
      <div class="box-border w-300px border rounded-10px bg-#e7f8ff p-20px">
        <div v-for="(item, index) in sessionList" :key="item?.id" :class="`mb-10px h-70px w-260px flex items-center rounded-10px bg-white px-14px py-10px shadow-[0px_2px_4px_0px_rgba(0,0,0,.05)] ${current === index && 'border-#1d93ab border'}`" @click="handleSetSession(item, index)">
          <AAvatar style="background-color: #1890ff" :src="item?.avatar">
            {{ item?.nickName || item?.userName }}
          </AAvatar>
          <div class="ml-2">
            {{ item?.userName }}
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col p-2">
        <div class="h-50px flex items-center border-b pl-4">
          <div class="text-xl font-bold">
            {{ currentSession.nickName }}
          </div>
        </div>
        <div ref="messageContentRef" class="flex-1 overflow-y-auto p-4">
          <div v-for="(item, index) in messageList" :key="index">
            <!-- left -->
            <div v-if="!item.isMe" class="my-4 flex">
              <div>
                <AAvatar style="background-color: #1890ff" :src="item?.info?.avatar">
                  {{ item?.info?.nickName || item?.info?.userName }}
                </AAvatar>
              </div>
              <div>
                <div class="ml-2">
                  <div>{{ item.info?.nickName }}</div>
                  <div class="mt-1 box-border border rounded-10px bg-[rgba(0,0,0,.05)] p-2">
                    <div v-if="item.type === MessageTypeEnum.TEXT">
                      {{ item.content }}
                    </div>
                    <div v-if="item.type === MessageTypeEnum.IMAGE">
                      <AImage
                        :width="400"
                        :src="item.content"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- right -->
            <div v-if="item.isMe" class="my-4 flex justify-end">
              <div>
                <div class="mr-2">
                  <div class="flex justify-end">
                    <!-- <div>
                    {{ item.createdAt }}
                  </div> -->
                    <div>
                      {{ item.info?.nickName }}
                    </div>
                  </div>
                  <div class="mt-1 box-border border rounded-10px bg-[rgba(0,0,0,.05)] p-2">
                    <div v-if="item.type === MessageTypeEnum.TEXT">
                      {{ item.content }}
                    </div>
                    <div v-if="item.type === MessageTypeEnum.IMAGE">
                      <AImage
                        :width="400"
                        :src="item.content"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <AAvatar style="background-color: #1890ff" :src="item?.info?.avatar">
                  {{ item?.info?.nickName || item?.info?.userName }}
                </AAvatar>
              </div>
            </div>
          <!-- end -->
          </div>
        </div>
        <div class="border-t">
          <div class="my-2">
            <AUpload :show-upload-list="false" :custom-request="handleUpload">
              <AButton>
                图片
              </AButton>
            </AUpload>
          </div>
          <ATextarea v-model:value="content" placeholder="请输入" />
          <AButton type="primary" class="mt-2" @click="handleSend(MessageTypeEnum.TEXT, content)">
            发送
          </AButton>
        </div>
      </div>
    </template>
  </div>
</template>
