import { mutation, query } from '@/utils/graphql'

export function initSpace(name: string) {
  return mutation({
    initSpace: [{ name }, {
      id: true,
    }],
  })
}

export function querySpace() {
  return query({
    querySpace: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export default { initSpace, querySpace }
