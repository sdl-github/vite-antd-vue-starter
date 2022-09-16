import { mutation, query } from "@/utils/graphql";
import { ValueTypes } from "@/utils/graphql/zeus";

export type FileQueryInput = {
  pageNo?: number;
  pageSize?: number;
  from?: string;
  to?: string;
  id?: string;
  name?: string;
  originName?: string;
  prefix?: string;
  extension?: string;
  mimeType?: string;
  bucket?: string;
  path?: ValueTypes["FilePathEnum"];
}

export function getFileList(input?: FileQueryInput) {
  return query({
    getFileList: [
      {
        ...input
      },
      {
        data: {
          id: true,
          /** 创建时间 */
          createdAt: true,
          /** 更新时间 */
          updatedAt: true,
          /** 文件名 */
          name: true,
          /** 原始文件名 */
          originName: true,
          /** 缩略图 */
          thumbnail: true,
          /** 文件前缀 */
          prefix: true,
          /** 文件后缀 */
          extension: true,
          /** mimeType */
          mimeType: true,
          /** 文件大小 */
          size: true,
          /** 存放桶名称 */
          bucket: true,
          /** 存放位置 */
          path: true,
          /** 文件url */
          url: true,
        },
        totalCount: true,
        hasNextPage: true
      }
    ]
  })
}