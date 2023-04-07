import { mutation, query } from '@/utils/graphql'
import type { ValueTypes } from '@/utils/graphql/zeus'

export function queryPostByMenuId(menuId: string) {
  return query({
    queryPost: [
      { menuId },
      {
        id: true,
        title: true,
        lock: true,
        published: true,
        currentVersionId: true,
        currentContent: true,
        createdAt: true,
      },
    ],
  })
}

export function updatePostVersion(versionId: string, content: string) {
  return mutation({
    updatePostVersion: [
      { versionId, content },
      { id: true },
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
