import { mutation, query } from '@/utils/graphql'
import type { ModelTypes } from '@/utils/graphql/zeus'
import request from '~/utils/request'

type Menu = ModelTypes['Menu']
export function queryMenuTree(params?: ModelTypes['MenuQueryPageParamInput']): Promise<Menu[]> {
  return request({
    url: '/menu/queryMenuTree',
    params,
  })
}

export function createMenu(input: ModelTypes['MenuCreateInputInput']) {
  return mutation({
    createMenu: [
      { input },
      { id: true },
    ],
  })
}

export function updateMenu(input: ModelTypes['MenuUpdateInputInput']) {
  return mutation({
    updateMenu: [
      { input },
      { id: true },
    ],
  })
}

export function deleteMenu(menuId: string) {
  return mutation({
    deleteMenu: [
      { menuId },
      true,
    ],
  })
}
