import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'
import { mutation } from '~/utils/graphql'

export function queryPhysicalExamPage(specification: ValueTypes['QueryPhysicalExamPageSpecificationInput']): Promise<ModelTypes['Page_PhysicalExam']> {
  return request({
    url: '/physical_exam/page',
    method: 'get',
    params: specification,
  })
}

export function createPhysicalExam(data: ModelTypes['PhysicalExam']): Promise<ModelTypes['PhysicalExam']> {
  return request({
    url: '/physical_exam/create',
    method: 'post',
    data,
  })
}

export function updatePhysicalExam(data: ModelTypes['PhysicalExam']): Promise<ModelTypes['PhysicalExam']> {
  return request({
    url: '/physical_exam/update',
    method: 'put',
    data,
  })
}

export function deletePhysicalExam(id: string): Promise<void> {
  return request({
    url: `/physical_exam/delete/${id}`,
    method: 'delete',
  })
}

export function setWarn(input?: ValueTypes['SetWarnInputInput']) {
  return mutation({
    setWarn: [
      { input },
      true,
    ],
  })
}
