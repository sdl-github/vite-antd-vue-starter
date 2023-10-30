import { defineStore } from 'pinia'
import type { ModelTypes } from '@/utils/graphql/zeus'
import { logout, userInfo } from '@/api/auth'
import { removeToken } from '~/utils/auth'

type LoginUser = ModelTypes['UserInfoResult']

export const useUserStore = defineStore('user', () => {
  const user = ref<LoginUser>()

  async function queryUserInfo() {
    const res = await userInfo()
    user.value = res.userInfo as LoginUser
    return res
  }

  async function init() {
    return await Promise.all([queryUserInfo()])
  }

  async function exit() {
    try {
      await logout()
    }
    catch (e) {
    }
    finally {
      user.value = {} as any
      removeToken()
    }
  }

  return {
    user,
    init,
    queryUserInfo,
    exit,
  }
})
