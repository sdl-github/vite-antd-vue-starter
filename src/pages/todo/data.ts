import type { TableColumnType } from 'ant-design-vue'
import type { ModelTypes, ValueTypes } from '@/utils/graphql/zeus'

export type QueryTodoPageSpecificationInput = ModelTypes['QueryTodoPageSpecificationInput']
export type Todo = ModelTypes['Todo']

export type CreateTodoInput = ModelTypes['CreateTodoInput']
export type UpdateTodoInput = ModelTypes['UpdateTodoInput']
export type FormModel = CreateTodoInput & UpdateTodoInput

export function generateFormModel(): FormModel {
  return {
    id: '',
    title: '',
    icon: '',
    content: '',
    planDate: '',
    warnDate: '',
    doneDate: '',
    sort: 999,
  }
}

export function generateSearch() {
  const search: QueryTodoPageSpecificationInput = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    title: '',
    sort: '',
  }
  return search
}
export interface State {
  loading: boolean
  modalVisible: boolean
  data: Todo[]
  currentItem: Todo | null
  search: QueryTodoPageSpecificationInput
  total: number
}
export const columns: TableColumnType<Todo>[] = [
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
    title: '内容',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
    sorter: true,
  },
  {
    title: '计划时间',
    width: '100px',
    align: 'center',
    dataIndex: 'planDate',
    key: 'planDate',
  },
  {
    title: '提醒时间',
    width: '100px',
    align: 'center',
    dataIndex: 'planDate',
    key: 'planDate',
  },
  {
    title: '完成时间',
    width: '100px',
    align: 'center',
    dataIndex: 'doneDate',
    key: 'doneDate',
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
