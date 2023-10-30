<script lang="ts" setup>
import { computed, ref, unref, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import useSWRV from 'swrv'
import UserSetPassword from './UserSetPassword.vue'
import UserInfoSetting from './UserInfoSetting.vue'
import { useUserStore } from '@/stores/user'
import { getLoginRecords, revoke } from '@/api/auth'

const emits = defineEmits(['ok'])
const open = ref(false)

interface IForm { }

const form = ref<IForm>({

})

enum ShowKey {
  setting,
  passwordSetting,
  userInfoSetting,
}
const revokeLoading = ref(false)

const userStore = useUserStore()

const showKey = ref(ShowKey.setting)

const user = computed(() => userStore.user)

const { data, mutate } = useSWRV('getLoginRecords', () => getLoginRecords())

const { pause, resume, isActive } = useIntervalFn(() => {
  mutate()
}, 5000)

const activeKey = ref('account')

watchEffect(() => {
  if (open.value) {
    userStore.init()
    resume()
  }
  else {
    pause()
  }
})

function ok() {
  emits('ok', unref(form))
}

function cancel() {
  open.value = false
}

function start() {
  open.value = true
  showKey.value = ShowKey.setting
}

function back() {
  showKey.value = ShowKey.setting
}

async function handleRevoke(id: string) {
  const loading = message.loading('加载中')
  try {
    revokeLoading.value = true
    await revoke(id)
    await mutate()
    loading()
    revokeLoading.value = false
    message.success('操作成功')
  }
  catch (e) {
    revokeLoading.value = false
    loading()
  }
}
defineExpose({
  start,
})
</script>

<template>
  <AModal
    :footer="false" :closable="true" :open="open" :mask-closable="false" :mask="true" width="680px"
    :mask-style="{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(243, 244, 246, 0.1)' }" @cancel="cancel" @ok="ok"
  >
    <div class="">
      <ATabs v-model:activeKey="activeKey" tab-position="left" @change="() => showKey = ShowKey.setting">
        <template #renderTabBar="{ DefaultTabBar, ...props }">
          <component :is="DefaultTabBar" v-bind="props" :style="{ width: 100 }" />
        </template>
        <ATabPane key="account" tab="账户">
          <template v-if="showKey === ShowKey.setting">
            <div class="text-25px font-bold">
              账户
            </div>
            <div class="mt-1">
              管理您的账户信息
            </div>
            <div class="mt-4 font-bold">
              个人资料
            </div>
            <ADivider class="my-2" />
            <div class="group w-full flex cursor-pointer items-center justify-between rounded-[7px] p-2 hover:bg-[#EFEFEF]" @click="() => showKey = ShowKey.userInfoSetting">
              <div class="flex items-center">
                <AAvatar :size="50" :src="user?.avatar" :alt="user?.nickName || user?.userName">
                  {{ user?.nickName || user?.userName }}
                </AAvatar>
                <div class="ml-4">
                  {{ user?.nickName || user?.userName }}
                </div>
              </div>
              <div class="i-carbon-arrow-right display-none group-hover:display-flex mr-6 text-12px" />
            </div>
            <div class="mt-4 font-bold">
              已连接的账户
            </div>
            <ADivider class="my-2" />
          </template>
          <UserInfoSetting v-if="showKey === ShowKey.userInfoSetting" @back="back" />
        </ATabPane>
        <ATabPane key="security" tab="安全">
          <template v-if="showKey === ShowKey.setting">
            <div class="text-25px font-bold">
              安全
            </div>
            <div class="mt-1">
              管理您的安全设置
            </div>
            <div class="mt-4 font-bold">
              密码
            </div>
            <ADivider class="my-2" />
            <div>
              <AButton @click="() => showKey = ShowKey.passwordSetting">
                {{ false ? "修改密码" : "设置密码" }}
              </AButton>
            </div>
            <div class="mt-4 font-bold">
              活动设备
            </div>
            <ADivider class="my-2" />
            <div class="max-h-400px overflow-auto">
              <div v-for="(record, index) in data" :key="index">
                <div class="group relative flex cursor-pointer items-center rounded-[7px] p-2 hover:bg-[#EFEFEF]">
                  <div class="h-80px w-80px">
                    <!-- <SvgIcon :name="false ? 'phone' : 'pc'" class="h-80px w-80px" /> -->
                  </div>
                  <div class="ml-4">
                    <div class="flex items-center">
                      <div>
                        {{ record.os }}
                      </div>
                      <div v-if="record.current" class="ml-2 text-12px text-#1677ff">
                        当前设备
                      </div>
                      <div v-if="record.expired" class="ml-2 text-12px text-#999AA5">
                        登录已过期
                      </div>
                    </div>
                    <div class="text-12px text-#000">
                      <div>
                        <span class="ml-2">{{ record.device }}</span>
                      </div>
                      <div>{{ record.ip }}</div>
                      <div>{{ record.createdAt }}</div>
                    </div>
                  </div>

                  <div v-if="!record.current" class="display-none group-hover:display-flex absolute right-20px">
                    <AButton :loading="revokeLoading" type="text" danger @click="handleRevoke(record.id)">
                      {{ record.expired ? '删除记录' : '退出设备' }}
                    </AButton>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <UserSetPassword v-if="showKey === ShowKey.passwordSetting" @back="back" />
        </ATabPane>
      </ATabs>
    </div>
  </AModal>
</template>
