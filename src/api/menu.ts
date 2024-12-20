import { mutation, query } from '@/utils/graphql'
import type { ValueTypes } from '@/utils/graphql/zeus'

type createMenuInput = ValueTypes['CreateMenuInput']
type editMenuInput = ValueTypes['EditMenuInput']

export interface QueryMenuInput {
  id?: string
  name?: string
  type?: string
  from?: string
  to?: string
}

export const queryMenuTree = async (input?: QueryMenuInput) => {
  return query({
    queryMenuTree: [{ ...input }, true],
  })
}

/**
 * 创建菜单
 * @param input
 * @returns
 */
export const createMenu = async (input: createMenuInput) => {
  return mutation({
    createMenu: [
      {
        input,
      },
      { code: true, msg: true },
    ],
  })
}

/**
 * 删除菜单
 * @param id
 */
export const deleteMenu = async (menuIds: string[]) => {
  return mutation({
    deleteMenus: [
      {
        menuIds,
      },
      { code: true, msg: true },
    ],
  })
}

/**
 * 修改菜单信息
 * @param input
 */
export const updateMenu = async (input: editMenuInput) => {
  return mutation({
    updateMenu: [
      {
        input,
      },
      {
        code: true,
        msg: true,
      },
    ],
  })
}

export const queryMenuList = async (onlyUser = false) => {
  return query({
    queryMenuList: [{ onlyUser }, {
      id: true,
      /** 创建时间 */
      createdAt: true,
      /** 更新时间 */
      updatedAt: true,
      /** 菜单名 */
      title: true,
      /** 菜单名 */
      name: true,
      /** 图标 */
      icon: true,
      /** 上级ID */
      pId: true,
      /** 排序 */
      orderBy: true,
      /** 路径 */
      path: true,
      /** 组件 */
      component: true,
      /** 可见 */
      visible: true,
      /** 权限字符 */
      permission: true,
      /** 类型 */
      type: true,
    }],
  })
}
