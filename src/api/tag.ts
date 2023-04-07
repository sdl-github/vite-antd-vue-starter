import { query } from '@/utils/graphql'

export function queryTagList(name?: string) {
  return query({
    queryTagList: [{ name }, {
      id: true,
      name: true,
      icon: true,
      createdAt: true,
      updatedAt: true,
    }],
  })
}
