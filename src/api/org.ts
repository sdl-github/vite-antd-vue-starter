import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryOrgPage(specification: ValueTypes['QueryOrgPageSpecificationInput']) {
  return query({
    queryOrgPage: [{ specification }, {
      content: {
        name: true,
        orgType: true,
        address: true,
        latitude: true,
        longitude: true,
        openTime: true,
        createdAt: true,
        lead: {
          userName: true,
          nickName: true,
        },
      },
      totalElements: true,
      hasNext: true,
    }],
  })
}

export function createOrg(data: ModelTypes['Org']): Promise<ModelTypes['Org']> {
  return request({
    url: '/article/category/create',
    method: 'post',
    data,
  })
}

export function updateOrg(data: ModelTypes['Org']): Promise<ModelTypes['Org']> {
  return request({
    url: '/article/category/update',
    method: 'put',
    data,
  })
}

export function deleteOrg(id: string): Promise<void> {
  return request({
    url: `/article/category/delete/${id}`,
    method: 'delete',
  })
}
