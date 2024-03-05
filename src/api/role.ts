import { mutation, query } from '@/utils/graphql'
import type { ModelTypes } from '@/utils/graphql/zeus'

export function queryAllRoleList() {
  return query({
    queryAllRoleList: {
      id: true,
      name: true,
      key: true,
    },
  })
}

export function queryRolePage(param: ModelTypes['RoleQueryParamInput']) {
  return query({
    queryRolePage: [{ param }, {
      content: {
        id: true,
        name: true,
        key: true,
        level: true,
        default: true,
        createdAt: true,
        createdBy: true,
        menus: {
          id: true,
          name: true,
          title: true,
          permission: true,
        },
      },
      totalElements: true,
    }],
  })
}

export function createRole(input: ModelTypes['CreateRoleInputInput']) {
  return mutation({
    createRole: [
      { input },
      { id: true },
    ],
  })
}

export function updateRole(input: ModelTypes['UpdateRoleInputInput']) {
  return mutation({
    updateRole: [{ input }, { id: true }],
  })
}

export function deleteRole(roleId: string) {
  return mutation({
    deleteRole: [{ roleId }, true],
  })
}
