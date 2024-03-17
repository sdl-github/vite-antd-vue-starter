import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'
import { mutation, query } from '~/utils/graphql'

export function queryOpenChat(userId: string) {
  return query({
    userOpenMessage: [{ userId }, true],
  })
}

export function setOpenChat(userId: string, open: boolean) {
  return mutation({
    setUserOpenMessage: [{ userId, open }, true],
  })
}
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

export function sendMessage(input: ValueTypes['SendMessageInputInput']) {
  return mutation({
    sendMessage: [{ input }, {
      id: true,
    }],
  })
}
