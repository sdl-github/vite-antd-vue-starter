import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'
import { query } from '~/utils/graphql'

export function queryMessageSessionPage(specification: ValueTypes['QueryMessageSessionPageSpecificationInput']) {
  return query({
    queryMessageSessionPage: [
      { specification },
      {
        content: {
          id: true,
          fromUserId: true,
          fromUser: {
            id: true,
            userName: true,
            nickName: true,
            avatar: true,
          },
          toUserId: true,
          toUser: {
            id: true,
            userName: true,
            nickName: true,
            avatar: true,
          },

        },
        hasNext: true,
      },
    ],
  })
}

export function queryMessagePage(specification: ValueTypes['QueryMessagePageSpecificationInput']) {
  return query({
    queryMessagePage: [
      { specification },
      {
        content: {
          id: true,
          content: true,
          type: true,
          createdAt: true,
          fromUser: {
            id: true,
            userName: true,
            nickName: true,
            avatar: true,
          },
          toUserId: true,
          toUser: {
            id: true,
            userName: true,
            nickName: true,
            avatar: true,
          },
        },
        hasNext: true,
      },
    ],
  })
}
