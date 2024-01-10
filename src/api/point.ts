import type { Page } from '.'
import type { ModelTypes } from '~/utils/graphql/zeus'
import request from '~/utils/request'

export function queryPointPage(params: ModelTypes['QueryPointPageParamInput']): Promise<Page<ModelTypes['Point']>> {
  return request({
    url: '/point/page',
    method: 'get',
    params,
  })
}
export function createPoint(data: ModelTypes['CreatePointInputInput']) {
  return request({
    url: '/point/create',
    method: 'post',
    data,
  })
}

export function deletePoint(id: string) {
  return request({
    url: '/point/delete',
    method: 'delete',
    params: { id },
  })
}

export function updatePoint(data: ModelTypes['UpdatePointInputInput']) {
  return request({
    url: '/point/update',
    method: 'put',
    data,
  })
}
