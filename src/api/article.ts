import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryArticlePage(specification: ModelTypes['QueryArticlePageSpecificationInput']) {
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

export function createArticle(input: ModelTypes['CreateArticleInput']) {
  return mutation({
    createArticle: [
      { input },
      {
        id: true,
      },
    ],
  })
}

export function updateArticle(input: ModelTypes['UpdateArticleInput']) {
  return mutation({
    updateArticle: [
      { input },
      {
        id: true,
      },
    ],
  })
}

export function delArticle(id: string) {
  return mutation({
    deleteArticle: [{ id }, true],
  })
}

export function queryArticle(id: string) {
  return query({
    queryArticle: [{ id }, {
      id: true,
      title: true,
      image: true,
      metaTitle: true,
      metaDescription: true,
      status: true,
      html: true,
      markdown: true,
      categoryId: true,
    }],
  })
}

export function publishArticle(id: string) {
  return mutation({
    publishArticle: [{ id }, true],
  })
}

export function unpublishArticle(id: string) {
  return mutation({
    unpublishArticle: [{ id }, true],
  })
}
