import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryAllBannerList() {
  return request({
    url: '/banner/queryAllBanner',
    method: 'get',
  })
}

export function createBanner(input: ValueTypes['CreateBannerInputInput']) {
  return mutation({
    createBanner: [{
      input,
    }, true],
  })
}

export function deleteBanner(id: string) {
  return mutation({
    deleteBanner: [{
      id,
    }, true],
  })
}
