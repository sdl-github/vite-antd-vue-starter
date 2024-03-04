import type { TableColumnType } from 'ant-design-vue'
import { type ModelTypes, OrgTypeEnum, type ValueTypes } from '@/utils/graphql/zeus'

export type QueryOrgPageSpecificationInput = ModelTypes['QueryOrgPageSpecificationInput']
export type Org = ModelTypes['Org']

export type CreateOrgInput = ModelTypes['CreateOrgInputInput']
export type UpdateOrgInput = ModelTypes['UpdateOrgInputInput']
export type FormModel = CreateOrgInput & UpdateOrgInput

export function generateFormModel(): FormModel {
  return {
    id: '',
    name: '',
    latitude: 0,
    longitude: 0,
  }
}

export const OrgTypeList = [
  {
    label: '社区',
    value: OrgTypeEnum.COMMUNITY,
  },
  {
    label: '医院',
    value: OrgTypeEnum.HOSPITAL,
  },
]

export const OrgType = Object.fromEntries(
  OrgTypeList.map(({ label, value }) => [value, label]),
)

export function generateSearch() {
  const search: QueryOrgPageSpecificationInput = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    name: '',
    sort: '',
    lat: undefined,
    lng: undefined,
  }
  return search
}
export interface State {
  loading: boolean
  modalVisible: boolean
  data: Org[]
  currentItem: Org | null
  search: QueryOrgPageSpecificationInput
  total: number
}

export const columns: TableColumnType<Org>[] = [
  {
    title: '名称',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    sorter: true,
  },
  {
    title: '类型',
    align: 'center',
    width: '100px',
    dataIndex: 'orgType',
    key: 'orgType',
  },
  {
    title: '负责人',
    width: '100px',
    align: 'center',
    dataIndex: 'head',
    key: 'head',
  },
  {
    title: '地址',
    width: '100px',
    align: 'center',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '营业时间',
    width: '100px',
    align: 'center',
    dataIndex: 'openTime',
    key: 'openTime',
  },
  {
    title: '创建时间',
    width: '100px',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '操作',
    width: '100px',
    key: 'operation',
    fixed: 'right',
  },
]
