import { mutation, query } from '@/utils/graphql'

export function queryPostByMenuId(menuId: string) {
  return query({
    queryPost: [
      { menuId },
      {
        id: true,
        title: true,
        lock: true,
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
