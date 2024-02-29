import { mutation, query } from '@/utils/graphql'
import type { ModelTypes } from '@/utils/graphql/zeus'

export function queryArticleCategoryTree(): Promise<ModelTypes['ArticleCategory'][]> {
  return request({
    url: '/article/category/tree',
  })
}

export function createArticleCategory(data: ModelTypes['ArticleCategory']): Promise<ModelTypes['ArticleCategory']> {
  return request({
    url: '/article/category/create',
    method: 'post',
    data,
  })
}

export function updateArticleCategory(data: ModelTypes['ArticleCategory']): Promise<ModelTypes['ArticleCategory']> {
  return request({
    url: '/article/category/update',
    method: 'put',
    data,
  })
}
