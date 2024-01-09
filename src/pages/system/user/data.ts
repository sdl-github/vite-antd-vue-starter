import type { TableColumnType } from 'ant-design-vue'

import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export type SearchParam = ModelTypes['UserQueryParamInput']
export type User = ModelTypes['User']

export type UserCreateInput = ModelTypes['UserCreateInputInput']
export type UserUpdateInput = ModelTypes['UserUpdateInputInput']

export const enum GenderEnum {
  MALE = '男',
  FEMALE = '女',
  UNKNOWN = '未知',
}
export const columns: TableColumnType<User>[] = [
  {
    title: '用户名',
    fixed: 'left',
    align: 'center',
    dataIndex: 'userName',
    key: 'userName',
    ellipsis: true,
    sorter: true,
  },
  {
    title: '头像',
    align: 'center',
    dataIndex: 'avatar',
  },
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'nickName',
    key: 'nickName',
    sorter: true,
  },
  {
    title: '性别',
    align: 'center',
    dataIndex: 'gender',
    key: 'gender',
    sorter: true,

  },
  {
    title: '手机',
    align: 'center',
    ellipsis: true,
    dataIndex: 'phone',
  },
  {
    title: '邮箱',
    align: 'center',
    ellipsis: true,
    dataIndex: 'email',
  },
  {
    title: '角色',
    align: 'center',
    width: 300,
    dataIndex: 'roles',
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
