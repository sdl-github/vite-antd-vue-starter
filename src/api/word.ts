import { query } from '~/utils/graphql'
import type { ValueTypes } from '~/utils/graphql/zeus'

export function queryWordRecordPage(specification?: ValueTypes['QueryWordRecordPageSpecificationInput']) {
  return query({
    queryWordRecordPage: [
      { specification },
      {
        content: {
          word: true,
          detail: true,
          type: true,
          user: {
            nickName: true,
          },
          createdAt: true,
        },
        hasNext: true,
        totalElements: true,
      },
    ],
  })
}

export function queryStudyPlanPage(specification?: ValueTypes['QueryStudyPlanPageSpecificationInput']) {
  return query({
    queryStudyPlanPage: [
      { specification },
      {
        content: {
          user: {
            nickName: true,
          },
          createdAt: true,
          planCount: true,
          dayCount: true,
        },
        totalPages: true,
        totalElements: true,
        hasNext: true,
      },
    ],
  })
}
