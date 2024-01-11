import type { TableColumnType } from 'ant-design-vue'

import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export type SearchParam = ModelTypes['QueryWarnEventParamInput']
export type WarnEvent = ModelTypes['WarnEvent']

export type WarnEventCreateInput = ModelTypes['CreateWarnEventInputInput']
export type WarnEventUpdateInput = ModelTypes['UpdateWarnEventInputInput']

export const columns: TableColumnType<WarnEvent>[] = [
  {
    title: '告警编号',
    align: 'center',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '告警时间',
    align: 'center',
    dataIndex: 'warnTime',
    key: 'warnTime',
  },
  {
    title: '告警人',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '告警等级',
    align: 'center',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: '告警位置',
    align: 'center',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '告警内容',
    align: 'center',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '操作',
    fixed: 'right',
    width: 300,
    key: 'operation',
    align: 'center',
  },
]
