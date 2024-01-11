import { mutation, query } from '@/utils/graphql'
import { FileProviderEnum, type ModelTypes } from '@/utils/graphql/zeus'

export function queryFilePage(param?: ModelTypes['FileQueryPageParamInput']) {
  return query({
    queryFilePage: [
      {
        param,
      },
      {
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

export function upload(file: File | Blob, bucket?: string): Promise<ModelTypes['File']> {
  const data = new FormData()
  data.append('file', file)
  data.append('provider', FileProviderEnum.LOCAL)
  if (bucket)
    data.append('bucket', bucket)

  return request({
    url: '/file/upload',
    method: 'post',
    data,
  })
}
