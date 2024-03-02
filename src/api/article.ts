import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryArticlePage(specification: ValueTypes['QueryArticlePageSpecificationInput']) {
  return query({
    queryArticlePage: [{ specification }, {
      content: {
        id: true,
        title: true,
        image: true,
        metaTitle: true,
        metaDescription: true,
        createdAt: true,
        publishedAt: true,
        status: true,
        category: {
          name: true,
        },
      },
      totalElements: true,
      hasNext: true,
    }],
  })
}



export function createArticle(input: ValueTypes["CreateArticleInputInput"]) {
  return mutation({
    createArticle: [
      { input }, {
        id: true
      }
    ]
  })
}