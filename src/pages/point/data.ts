import type { TableColumnType } from 'ant-design-vue'

import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export type SearchParam = ModelTypes['QueryPointPageParamInput']
export type Point = ModelTypes['Point']

export type PointCreateInput = ModelTypes['CreatePointInputInput']
export type PointUpdateInput = ModelTypes['UpdatePointInputInput']

export const columns: TableColumnType<Point>[] = [
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: '点类型',
    align: 'center',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'x',
    align: 'center',
    dataIndex: 'x',
    key: 'x',
    ellipsis: true,
  },
  {
    title: 'y',
    align: 'center',
    dataIndex: 'y',
    key: 'y',
    ellipsis: true,
  },
  {
    title: 'z',
    align: 'center',
    dataIndex: 'z',
    key: 'z',
    ellipsis: true,
  },
  {
    title: 'level',
    align: 'center',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: '文件',
    align: 'center',
    dataIndex: 'file',
    key: 'file',
    ellipsis: true,
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '操作',
    fixed: 'right',
    width: 300,
    key: 'operation',
    align: 'center',
  },
]
