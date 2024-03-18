import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'
import { mutation, query } from '~/utils/graphql'

export function queryCommentPage(specification: ValueTypes['QueryCommentPageSpecificationInput']) {
  return query({
    queryCommentPage: [{ specification }, {
      content: {
        id: true,
        createdAt: true,
        content: true,
        org: {
          name: true,
        },
        user: {
          nickName: true,
          userName: true,
        },
        reply: true,
        replyAt: true,
        replyUser: {
          nickName: true,
          userName: true,
        },
      },
      totalElements: true,
      hasNext: true,
    }],
  })
}

export function createComment(data: ModelTypes['Comment']): Promise<ModelTypes['Comment']> {
  return request({
    url: '/comment/create',
    method: 'post',
    data,
  })
}

export function updateComment(data: ModelTypes['Comment']): Promise<ModelTypes['Comment']> {
  return request({
    url: '/comment/update',
    method: 'put',
    data,
  })
}

export function deleteComment(id: string): Promise<void> {
  return request({
    url: `/comment/delete/${id}`,
    method: 'delete',
  })
}

export function replyComment(input: ValueTypes['ReplyCommentInputInput']) {
  return mutation({
    replyComment: [
      { input },
      { id: true },
    ],
  })
}
