import type { TableColumnType } from 'ant-design-vue'

import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export type SearchParam = ModelTypes['QueryMenuSpecInput']
export type Menu = ModelTypes['Menu']

export type MenuType = ModelTypes['MenuTypeEnum']

export type MenuCreateInput = ModelTypes['CreateMenuInput']
export type MenuUpdateInput = ModelTypes['UpdateMenuInput']

export const columns: TableColumnType<Menu>[] = [
  {
    title: '标题',
    align: 'center',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '标识',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '图标',
    align: 'center',
    dataIndex: 'icon',
  },
  {
    title: '路由',
    align: 'center',
    dataIndex: 'path',
  },
  {
    title: '是否可见',
    align: 'center',
    dataIndex: 'visible',
    sorter: true,
  },
  {
    title: '排序',
    align: 'center',
    dataIndex: 'sort',
    sorter: true,
  },
  {
    title: '创建时间',
    align: 'center',
    width: 180,
    dataIndex: 'createdAt',
    sorter: true,
  },
  {
    title: '操作',
    width: 180,
    fixed: 'right',
    key: 'operation',
    align: 'center',
  },
]
