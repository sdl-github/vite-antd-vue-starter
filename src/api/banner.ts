import { mutation, query } from '@/utils/graphql'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export function queryAllBannerList() {
  return request({
    url: '/banner/queryAllBanner',
    method: 'get',
  })
}
