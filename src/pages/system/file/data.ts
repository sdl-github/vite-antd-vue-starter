import type { TableColumnType } from 'ant-design-vue'
import { FileProviderEnum, type ModelTypes, type ValueTypes } from '@/utils/graphql/zeus'

export type File = ModelTypes['File']

export type SearchParam = ValueTypes['FileQueryPageParamInput']

export type TFileProviderEnum = ValueTypes['FileProviderEnum']

export const providerOption = [
  {
    label: '缤纷云',
    value: FileProviderEnum.BITIFUL_S4,
  },
]
export const providerOptionEnum: {
  [key: string]: {
    label: string
    value: string
  }
} = {}

providerOption.forEach(item => providerOptionEnum[item.value] = item)

export const columns: TableColumnType<File>[] = [
  {
    title: '存储提供服务方',
    align: 'center',
    width: 140,
    dataIndex: 'provider',
    customRender: opt => providerOptionEnum[opt.value].label,
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
    title: '创建人',
    align: 'center',
    width: 180,
    dataIndex: 'createdBy',
  },
  {
    title: '操作',
    width: 180,
    fixed: 'right',
    key: 'operation',
    align: 'center',
  },
]
