import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryUserPage(specification: ValueTypes['QueryUserPageSpecificationInput']) {
  return query({
    queryUserPage: [{ specification }, {
      content: {
        id: true,
        userName: true,
        nickName: true,
        avatar: true,
        phone: true,
        email: true,
        gender: true,
        note: true,
        roles: {
          id: true,
          name: true,
        },
        createdAt: true,
        createdBy: true,
      },
      totalElements: true,
      totalPages: true,
      hasNext: true,
      hasContent: true,
    }],
  })
}

export function createUser(input: ValueTypes['CreateUserInput']) {
  return mutation({
    createUser: [{ input }, { id: true }],
  })
}

export function updateUser(input: ModelTypes['UpdateUserInput']) {
  return mutation({
    updateUser: [{ input }, { id: true }],
  })
}

export function deleteUser(userId: string) {
  return mutation({
    deleteUser: [{ userId }, true],
  })
}

export function queryAllUserList(): Promise<ModelTypes['User'][]> {
  return request({
    url: '/user/queryAllUserList',
    method: 'get',
  })
}
