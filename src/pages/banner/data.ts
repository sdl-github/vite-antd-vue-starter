import type { TableColumnType } from 'ant-design-vue'
import type { ModelTypes } from '@/utils/graphql/zeus'

export type Banner = ModelTypes['Banner']

export type CreateBannerInput = ModelTypes['CreateBannerInputInput']
export type FormModel = CreateBannerInput & UpdateBannerInput

export function generateFormModel(): FormModel {
  return {
  }
}

export function generateSearch() {

}
export interface State {
  loading: boolean
  modalVisible: boolean
  data: Banner[]
  currentItem: Banner | null
  total: number
}

export const columns: TableColumnType<Banner>[] = [
  {
    title: '意见人',
    align: 'center',
    width: '100px',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: '意见内容',
    fixed: 'left',
    align: 'center',
    width: '300px',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
  },
  {
    title: '意见时间',
    width: '100px',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '机构',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'org',
    key: 'org',
    ellipsis: true,
  },
  {
    title: '回复人',
    align: 'center',
    width: '100px',
    dataIndex: 'replyUser',
    key: 'replyUser',
  },
  {
    title: '回复内容',
    fixed: 'left',
    align: 'center',
    width: '300px',
    dataIndex: 'reply',
    key: 'reply',
    ellipsis: true,
  },
  {
    title: '回复时间',
    width: '100px',
    align: 'center',
    dataIndex: 'replyAt',
    key: 'replyAt',
  },
  {
    title: '状态',
    width: '100px',
    align: 'center',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    width: '100px',
    key: 'operation',
    fixed: 'right',
  },
]
