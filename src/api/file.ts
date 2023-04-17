import { mutation, query } from '@/utils/graphql'
import request from '@/utils/graphql/request'

export function uploadSinlgeFile(file: File) {
  const data = new FormData()
  data.append('file', file)
  return request({
    url: '/api/file/upload',
    method: 'post',
    data,
  })
}

export interface FileQueryArg {
  pageNo?: number
  pageSize?: number
  fileName?: string
  originalName?: string
  from?: string
  to?: string
}
export function queryFilePage(args: FileQueryArg) {
  return query({
    queryFilePage: [{
      ...args,
    }, {
      data: {
        id: true,
        fileName: true,
        originalName: true,
        url: true,
        mimeType: true,
        size: true,
        bucket: true,
        provider: true,
        category: true,
        hash: true,
        createdAt: true,
      },
      totalCount: true,
      hasNextPage: true,
    }],
  })
}

export function delFile(id: string) {
  return mutation({
    delFile: [{ id }, true],
  })
}
