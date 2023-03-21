import { defineStore } from 'pinia'
import { login, logout, userInfo } from '@/api/auth'
import { queryMenuList as queryMenu } from '@/api/menu'
import type { ModelTypes } from '@/utils/graphql/zeus'

type LoginUser = ModelTypes['LoginUser']
export const useUserStore = defineStore('user', () => {
  const user = ref<LoginUser>()
  const menus = ref<ModelTypes['Menu'][]>([])

  async function loginByAccount(username: string, password: string) {
    try {
      const { login: { accessToken } } = await login(username, password)
      setToken(accessToken)
      return true
    }
    catch (e) {
      return false
    }
  }

  async function queryUserInfo() {
    const res = await userInfo()
    user.value = res.userInfo as LoginUser
    return res
  }

  async function queryMenuList() {
    const res = await queryMenu()
    menus.value = res.queryMenuList
    return res
  }

  async function init() {
    return await Promise.all([queryUserInfo(), queryMenuList()])
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
    menus,
    init,
    loginByAccount,
    queryUserInfo,
    exit,
  }
})
