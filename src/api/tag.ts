import { mutation, query } from '@/utils/graphql'
import type { ValueTypes } from '@/utils/graphql/zeus'

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

export function createTag(input: ValueTypes['CreateTagInput']) {
  return mutation({
    createTag: [
      { input }, {
        id: true,
        name: true,
      }],
  })
}
