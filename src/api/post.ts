import { mutation, query } from '@/utils/graphql'
import type { ValueTypes } from '@/utils/graphql/zeus'

export interface PostQueryInput {
  pageNo?: number
  pageSize?: number
}

export function queryPostPage(input?: PostQueryInput) {
  return query({
    queryPostPage: [{
      ...input,
    }, {
      data: {
        id: true,
        title: true,
        description: true,
        user: {
          id: true,
          username: true,
          nickname: true,
          avatar: true,
        },
        tags: {
          id: true,
          name: true,
        },
        createdAt: true,
      },
      totalCount: true,
      hasNextPage: true,
    }],
  })
}

export function queryPost(input: { menuId?: string; postId?: string }) {
  return query({
    queryPost: [
      { ...input },
      {
        id: true,
        title: true,
        lock: true,
        published: true,
        description: true,
        currentVersionId: true,
        currentContent: true,
        createdAt: true,
        user: {
          id: true,
          username: true,
          nickname: true,
          avatar: true,
        },
        tags: {
          id: true,
          name: true,
        },
        menu: {
          id: true,
        },
        updatedAt: true,
      },
    ],
  })
}

export function updatePostVersion(versionId: string, content: string) {
  return mutation({
    updatePostVersion: [
      { versionId, content },
      { id: true, updatedAt: true },
    ],
  })
}

export function publishPost(input: ValueTypes['PublishPostInput']) {
  return mutation({
    publishPost: [
      { input }, {
        id: true,
      },
    ],
  })
}

export function unPublishPost(postId: string) {
  return mutation({
    unPublishPost: [
      { postId }, {
        id: true,
      },
    ],
  })
}
