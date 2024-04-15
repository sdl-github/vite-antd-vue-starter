import type { TableColumnType } from 'ant-design-vue'
import { ActivityStatusEnum, type ModelTypes, type ValueTypes } from '@/utils/graphql/zeus'

export type QueryActivityPageSpecificationInput = ModelTypes['QueryActivityPageSpecificationInput']
export type Activity = ModelTypes['Activity']

export type CreateActivityInput = ModelTypes['CreateActivityInputInput']
export type UpdateActivityInput = ModelTypes['UpdateActivityInputInput']
export type FormModel = CreateActivityInput & UpdateActivityInput

export function generateFormModel(): FormModel {
  return {
    id: undefined,
    title: '未命名活动',
    html: '',
    markdown: '',
    image: '',
    metaTitle: '',
    metaDescription: '',
  }
}

export const ActivityStatusList = [
  {
    label: '草稿',
    value: ActivityStatusEnum.DRAFT,
  },
  {
    label: '已发布',
    value: ActivityStatusEnum.PUBLISHED,
  },
]

export const ActivityStatus = Object.fromEntries(
  ActivityStatusList.map(({ label, value }) => [value, label]),
)

export function generateSearch() {
  const search: QueryActivityPageSpecificationInput = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    title: '',
    markdown: '',
    sort: '',
  }
  return search
}
export interface State {
  loading: boolean
  modalVisible: boolean
  data: Activity[]
  currentItem: Activity | null
  search: QueryActivityPageSpecificationInput
  total: number
}
export const columns: TableColumnType<Activity>[] = [
  {
    title: '标题',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    sorter: true,
  },
  {
    title: '状态',
    width: '100px',
    align: 'center',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    width: '100px',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '发布时间',
    width: '100px',
    align: 'center',
    dataIndex: 'publishedAt',
    key: 'publishedAt',
  },
  {
    title: '操作',
    width: '100px',
    key: 'operation',
    fixed: 'right',
  },
]
