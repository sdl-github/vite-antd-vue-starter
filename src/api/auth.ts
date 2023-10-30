import { mutation, query } from '@/utils/graphql'
import type { ModelTypes } from '@/utils/graphql/zeus'
import request from '~/utils/request'

export function loginByAccount(account: string, password: string) {
  return mutation({
    loginByAccount: [{ input: { account, password } }, true],
  })
}

export function logout() {
  return mutation({
    logout: true,
  })
}

export function userInfo() {
  return query({
    userInfo: {
      id: true,
      userName: true,
      nickName: true,
      avatar: true,
      superAdmin: true,
      menus: {
        id: true,
        parentId: true,
        name: true,
        title: true,
        type: true,
        icon: true,
        path: true,
      },
      roles: {
        id: true,
        name: true,
        key: true,
      },
      permissions: true,
    },
  })
}

export function getLoginRecords() {
  return request({
    url: '/auth/sessionRecords',
  }) as Promise<ModelTypes['LoginSessionResult'][]>
}

export function revoke(id: string) {
  return request({
    url: '/auth/revoke',
    method: 'POST',
    params: { id },
  })
}
