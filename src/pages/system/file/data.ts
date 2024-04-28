import type { TableColumnType } from 'ant-design-vue'
import { FileProviderEnum, type ModelTypes, type ValueTypes } from '@/utils/graphql/zeus'

export type File = ModelTypes['File']

export type SearchParam = ModelTypes['QueryFilePageSpecInput']

export type TFileProviderEnum = ModelTypes['FileProviderEnum']

export const providerOption = [
  {
    label: '缤纷云',
    value: FileProviderEnum.BITIFUL_S4,
  },
  {
    label: '本地',
    value: FileProviderEnum.LOCAL,
  },
]
export const providerOptionMap = providerOption.reduce((map, item) => {
  map[item.value] = item.label
  return map
}, {} as Record<TFileProviderEnum, string>)

export const columns: TableColumnType<File>[] = [
  {
    title: '存储提供服务方',
    align: 'center',
    width: 140,
    dataIndex: 'provider',
  },
  {
    title: '存储桶',
    align: 'center',
    width: 100,
    dataIndex: 'bucket',
  },
  {
    title: '文件名',
    align: 'center',
    width: 180,
    dataIndex: 'fileName',
    ellipsis: true,
  },
  {
    title: '原始文件名',
    align: 'center',
    width: 180,
    dataIndex: 'originName',
    ellipsis: true,
  },
  {
    title: '文件类型',
    align: 'center',
    width: 180,
    ellipsis: true,
    dataIndex: 'mimeType',
  },
  {
    title: '文件大小',
    align: 'center',
    width: 180,
    dataIndex: 'size',
  },
  {
    title: '创建时间',
    align: 'center',
    width: 180,
    dataIndex: 'createdAt',
  },
  {
    title: '操作',
    width: 180,
    fixed: 'right',
    key: 'operation',
    align: 'center',
  },
]
