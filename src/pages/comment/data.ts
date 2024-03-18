import type { TableColumnType } from 'ant-design-vue'
import type { ModelTypes } from '@/utils/graphql/zeus'

export type QueryCommentPageSpecificationInput = ModelTypes['QueryCommentPageSpecificationInput']
export type Comment = ModelTypes['Comment']

export type CreateCommentInput = ModelTypes['CreateCommentInputInput']
export type UpdateCommentInput = ModelTypes['UpdateCommentInputInput']
export type FormModel = CreateCommentInput & UpdateCommentInput

export function generateFormModel(): FormModel {
  return {
  }
}

export function generateSearch() {
  const search: QueryCommentPageSpecificationInput = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    sort: '',
    content: undefined,
  }
  return search
}
export interface State {
  loading: boolean
  modalVisible: boolean
  data: Comment[]
  currentItem: Comment | null
  search: QueryCommentPageSpecificationInput
  total: number
}

export const columns: TableColumnType<Comment>[] = [
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
