import { query } from '@/utils/graphql'

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
