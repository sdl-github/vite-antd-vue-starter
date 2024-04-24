import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryAllRoleList() {
  return query({
    queryAllRoleList: {
      id: true,
      name: true,
      key: true,
    },
  })
}

export function queryRolePage(specification: ValueTypes['QueryRolePageSpecificationInput']) {
  return query({
    queryRolePage: [{ specification }, {
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

export function createRole(input: ModelTypes['CreateRoleInput']) {
  return mutation({
    createRole: [
      { input },
      { id: true },
    ],
  })
}

export function updateRole(input: ModelTypes['UpdateRoleInput']) {
  return mutation({
    updateRole: [{ input }, { id: true }],
  })
}

export function deleteRole(roleId: string) {
  return mutation({
    deleteRole: [{ roleId }, true],
  })
}
