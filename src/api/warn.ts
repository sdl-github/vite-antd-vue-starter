import type { Page } from '.'
import type { ModelTypes } from '~/utils/graphql/zeus'
import request from '~/utils/request'

export function queryWarnEventPage(params: ModelTypes['QueryWarnEventParamInput']): Promise<Page<ModelTypes['WarnEvent']>> {
  return request({
    url: '/warn-event/page',
    method: 'get',
    params,
  })
}

export function createWarnEventPage(data: ModelTypes['CreateWarnEventInputInput']): Promise<Page<ModelTypes['WarnEvent']>> {
  return request({
    url: '/warn-event/create',
    method: 'post',
    data,
  })
}

export function updateWarnEventPage(data: ModelTypes['UpdateWarnEventInputInput']): Promise<Page<ModelTypes['WarnEvent']>> {
  return request({
    url: '/warn-event/update',
    method: 'put',
    data,
  })
}

export function deleteWarnEvent(id: string) {
  return request({
    url: '/warn-event/delete',
    method: 'delete',
    params: { id },
  })
}
