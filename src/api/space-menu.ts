import { mutation, query } from '@/utils/graphql'
import type { ValueTypes } from '@/utils/graphql/zeus'

export function querySpaceMenu(spaceId: string) {
  return query({
    querySpaceMenu: [
      { spaceId }, {
        id: true,
        title: true,
        icon: true,
        iconType: true,
        pId: true,
        order: true,
      },
    ],
  })
}

export function createSpaceMenu(input: ValueTypes['CreateSpaceMenuInput']) {
  return mutation({
    createSpaceMenu: [
      { input }, {
        id: true,
      },
    ],
  })
}

export function moveSpaceMenuToRecycleBin(menuId: string) {
  return mutation({
    moveSpaceMenuToRecycleBin: [{ menuId }, true],
  })
}

export default { querySpaceMenu, createSpaceMenu, moveSpaceMenuToRecycleBin }
