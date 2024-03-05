import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'
import { query } from '~/utils/graphql'

export function queryDoctorSchedulePage(specification: ValueTypes['QueryDoctorSchedulePageSpecificationInput']) {
  return query({
    queryDoctorSchedulePage: [{ specification }, {
      content: {
        id: true,
        date: true,
        shift: true,
        doctorId: true,
        doctor: {
          userName: true,
          nickName: true,
        },
        orgId: true,
        org: {
          name: true,
        },
        createdAt: true,
      },
      totalElements: true,
      hasNext: true,
    }],
  })
}

export function createDoctorSchedule(data: ModelTypes['DoctorSchedule']): Promise<ModelTypes['DoctorSchedule']> {
  return request({
    url: '/doctor/schedule/create',
    method: 'post',
    data,
  })
}

export function updateDoctorSchedule(data: ModelTypes['DoctorSchedule']): Promise<ModelTypes['DoctorSchedule']> {
  return request({
    url: '/doctor/schedule/update',
    method: 'put',
    data,
  })
}

export function deleteDoctorSchedule(id: string): Promise<void> {
  return request({
    url: `/doctor/schedule/delete/${id}`,
    method: 'delete',
  })
}
