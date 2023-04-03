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

export function updateSpaceMenuTitle(menuId: string, title: string) {
  return mutation({
    updateSpaceMenuTitle: [{ menuId, title }, { id: true }],
  })
}

export function updateSpaceMenu(input: ValueTypes['UpdateSpaceMenuInput']) {
  return mutation({
    updateSpaceMenu: [
      { input }, {
        id: true,
      },
    ],
  })
}

export default {
  querySpaceMenu,
  createSpaceMenu,
  moveSpaceMenuToRecycleBin,
  updateSpaceMenuTitle,
  updateSpaceMenu,
}
