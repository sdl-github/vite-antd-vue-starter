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
    title: '单词',
    fixed: 'left',
    align: 'center',
    width: '300px',
    dataIndex: 'word',
    key: 'word',
    ellipsis: true,
  },
  {
    title: '解析',
    fixed: 'left',
    align: 'center',
    width: '300px',
    dataIndex: 'detail',
    key: 'detail',
    ellipsis: true,
  },
  {
    title: '类型',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '用户',
    align: 'center',
    width: '100px',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: '创建时间',
    width: '100px',
    align: 'center',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
]
