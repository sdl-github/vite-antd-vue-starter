import { mutation, query } from '@/utils/graphql'
import type { ModelTypes } from '@/utils/graphql/zeus'

export function queryUserPage(specification: ModelTypes['QueryUserPageSpecificationInput']) {
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
        job: true,
        orgId: true,
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

export function createUser(input: ModelTypes['CreateUserInputInput']) {
  return mutation({
    createUser: [{ input }, { id: true }],
  })
}

export function updateUser(input: ModelTypes['UpdateUserInputInput']) {
  return mutation({
    updateUser: [{ input }, { id: true }],
  })
}

export function deleteUser(userId: string) {
  return mutation({
    deleteUser: [{ userId }, true],
  })
}

export function queryUserList(key: string): Promise<ModelTypes['User'][]> {
  return request({
    url: '/user/queryUserList',
    method: 'get',
    params: {
      key,
    },
  })
}
