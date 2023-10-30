import { mutation, query } from '@/utils/graphql'
import type { ModelTypes } from '@/utils/graphql/zeus'

export function queryFilePage(param?: ModelTypes['FileQueryPageParamInput']) {
  return query({
    queryFilePage: [
      {
        param,
      }, {
        content: {
          id: true,
          fileName: true,
          originName: true,
          fileSize: true,
          fileHash: true,
          provider: true,
          bucket: true,
          mimeType: true,
          createdAt: true,
          category: true,
          url: true,
        },
        totalElements: true,
        totalPages: true,
        hasNext: true,
        hasContent: true,
      },
    ],
  })
}

export function deleteFileById(id: string) {
  return mutation({
    deleteFileById: [{ id }, true],
  })
}
