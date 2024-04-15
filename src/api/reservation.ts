import axios from 'axios'
import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryReservationPage(params: ValueTypes['QueryReservationPageSpecificationInput']) {
  return request({
    url: '/reservation/page',
    params
  })
}
export function queryReservationDoctorPage(params: ValueTypes['QueryReservationPageSpecificationInput']) {
  return request({
    url: '/reservation/page/doctor',
    params
  })
}

export function createReservation(data: ModelTypes['Reservation']): Promise<ModelTypes['Reservation']> {
  return request({
    url: '/reservation/create',
    method: 'post',
    data,
  })
}

export function updateReservation(data: ModelTypes['Reservation']): Promise<ModelTypes['Reservation']> {
  return request({
    url: '/reservation/updateStatus',
    method: 'post',
    data,
  })
}

export function deleteOrg(id: string): Promise<void> {
  return request({
    url: `/org/delete/${id}`,
    method: 'delete',
  })
}

export function deleteReservation(id: string) {
  return request({
    url: `/reservation/delete/${id}`,
    method: 'delete'
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
