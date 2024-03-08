<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="ts">
import useSWRV from 'swrv'
import InfiniteLoading from 'v3-infinite-loading'
import { queryMessagePage, queryMessageSessionPage } from '@/api/chat'
import { MessageTypeEnum, type ModelTypes } from '~/utils/graphql/zeus'

const userStore = useUserStore()
const user = computed(() => userStore.user)
const { data, mutate } = useSWRV(`queryOrgPage`, () => queryMessageSessionPage({
  pageNo: 1,
  pageSize: 10,
}))

const current = ref(0)

mutate()

const sessionList = computed(() => {
  const userId = user.value?.id as string
  return data.value?.queryMessageSessionPage?.content?.map((item) => {
    const { fromUserId, fromUser, toUserId, toUser } = item
    const userObj = {
      [fromUserId!]: toUser,
      [toUserId!]: fromUser,
    }
    return userObj[userId]
  })
})
const hasNext = ref(true)
const params = reactive<ModelTypes['QueryMessagePageSpecificationInput']>({
  pageNo: 0,
  pageSize: 10,
})

const currentSession = computed(() => sessionList.value && sessionList.value[current.value] || {})

const messageList = ref<ModelTypes['Message'][]>([
  {
    fromUser: {
      id: '1',
      nickName: '张三',
    },
    type: MessageTypeEnum.TEXT,
    content: 'Use box-border to set an element’s box-sizing to border-box, telling the browser to include the element’s borders and padding when you give it a height or width.',
  },
  {
    fromUser: {
      id: '1',
      nickName: '张三',
    },
    type: MessageTypeEnum.IMAGE,
    content: 'https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/d6/wallhaven-d6dvdl.png?w=2560&h=1440&fmt=webp',
  },
])

async function loadMoreData($state?: any) {
  if (!hasNext.value) {
    $state && $state.complete()
    return
  }
  params.pageNo = params.pageNo + 1
  try {
    const res = await queryMessagePage(params)!
    const { content, hasNext: hasNextPage } = res.queryMessagePage!
    messageList.value?.push(...content!)
    $state && $state.loaded()
    hasNext.value = !!hasNextPage
    if (!hasNextPage)
      $state && $state.complete()
  }
  catch (e) {
    $state && $state.error()
  }
}

function handleSetSession(item: ModelTypes['Message'], index: number) {
  current.value = index
}

function showMessage(item: ModelTypes['Message'], isMe: boolean) {
  return true
}
</script>

<template>
  <div class="m-4 h-90% flex border rounded-10px bg-white">
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
      <div class="flex-1 overflow-y-auto p-4">
        <InfiniteLoading :firstload="true" :top="true" @infinite="loadMoreData">
          <template #spinner>
            <div class="w-full flex justify-center py-4">
              <ASpin />
            </div>
          </template>
          <template #complete>
            <div class="w-full flex justify-center py-4 text-12px color-[#515767]">
              <span>上面没有了</span>
            </div>
          </template>
        </InfiniteLoading>
        <div v-for="(item, index) in messageList" :key="index">
          <!-- left -->
          <div v-if="showMessage(item, false)" class="my-2 flex">
            <div>
              <AAvatar style="background-color: #1890ff" :src="item?.fromUser?.avatar">
                {{ item?.fromUser?.nickName || item?.fromUser?.userName }}
              </AAvatar>
            </div>
            <div>
              <div class="ml-2">
                <div>{{ item.fromUser?.nickName }}</div>
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
          <div v-if="showMessage(item, true)" class="my-2 flex justify-end">
            <div>
              <div class="mr-2">
                <div class="flex justify-end">
                  {{ item.fromUser?.nickName }}
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
              <AAvatar style="background-color: #1890ff" :src="item?.fromUser?.avatar">
                {{ item?.fromUser?.nickName || item?.fromUser?.userName }}
              </AAvatar>
            </div>
          </div>
          <!-- end -->
        </div>
      </div>
      <div class="border-t">
        <div class="my-2">
          <div>图片</div>
        </div>
        <ATextarea placeholder="请输入" />
        <AButton type="primary" class="mt-2">
          发送
        </AButton>
      </div>
    </div>
  </div>
</template>
