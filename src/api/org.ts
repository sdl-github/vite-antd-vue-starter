import axios from 'axios'
import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryOrgPage(specification: ValueTypes['QueryOrgPageSpecificationInput']) {
  return query({
    queryOrgPage: [{ specification }, {
      content: {
        id: true,
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
    url: '/org/create',
    method: 'post',
    data,
  })
}

export function updateOrg(data: ModelTypes['Org']): Promise<ModelTypes['Org']> {
  return request({
    url: '/org/update',
    method: 'put',
    data,
  })
}

export function deleteOrg(id: string): Promise<void> {
  return request({
    url: `/org/delete/${id}`,
    method: 'delete',
  })
}

export interface GeoCode {
  country: string
  province: string
  city: string
  district: string
  street: string
  streetNumber: string
  formatted_address: string
  number: string
  location: string
}

interface GeoResult {
  status: 0 | 1
  geocodes: GeoCode[]
}

export function queryGeoByAddress(address: string): Promise<GeoResult> {
  return new Promise((resolve, reject) => {
    axios({
      url: `https://restapi.amap.com/v3/geocode/geo`,
      method: 'get',
      params: {
        key: '0f4b5610c37591a36d33e81221c58409',
        address,
      },
    })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
