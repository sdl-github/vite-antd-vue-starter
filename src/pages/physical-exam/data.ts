import type { TableColumnType } from 'ant-design-vue'
import dayjs from 'dayjs'
import type { ModelTypes } from '@/utils/graphql/zeus'

export type QueryPhysicalExamPageSpecificationInput = ModelTypes['QueryPhysicalExamPageSpecificationInput']
export type PhysicalExam = ModelTypes['PhysicalExam']

export type CreatePhysicalExamInput = ModelTypes['CreatePhysicalExamInputInput']
export type FormModel = CreatePhysicalExamInput

export function generateFormModel(): FormModel {
  return {
    date: dayjs().format('YYYY-MM-DD'),
  }
}

export function generateSearch() {
  const search: QueryPhysicalExamPageSpecificationInput = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    orgName: '',
    userName: '',
    sort: 'createdAt desc',
  }
  return search
}

export interface State {
  loading: boolean
  modalVisible: boolean
  data: PhysicalExam[]
  currentItem: PhysicalExam | null
  search: QueryPhysicalExamPageSpecificationInput
  total: number
}

export const columns: TableColumnType<PhysicalExam>[] = [
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
    title: '姓名',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'user',
    key: 'user',
    ellipsis: true,
  },
  {
    title: '日期',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'date',
    key: 'date',
    ellipsis: true,
  },
  {
    title: '身高',
    align: 'center',
    width: '100px',
    dataIndex: 'height',
    key: 'height',
  },
  {
    title: '体重',
    width: '100px',
    align: 'center',
    dataIndex: 'weight',
    key: 'weight',
  },
  {
    title: '血压',
    width: '100px',
    align: 'center',
    dataIndex: 'bloodPressure',
    key: 'bloodPressure',
  },
  {
    title: '心率',
    width: '100px',
    align: 'center',
    dataIndex: 'heartRate',
    key: 'heartRate',
  },
  {
    title: '胆固醇水平',
    width: '100px',
    align: 'center',
    dataIndex: 'cholesterolLevel',
    key: 'cholesterolLevel',
  },
  {
    title: '血糖水平',
    width: '100px',
    align: 'center',
    dataIndex: 'sugarLevel',
    key: 'sugarLevel',
  },
  {
    title: '检查结果/建议',
    width: '100px',
    align: 'center',
    dataIndex: 'result',
    key: 'result',
  },
  {
    title: '备注',
    width: '100px',
    align: 'center',
    dataIndex: 'doctorNotes',
    key: 'doctorNotes',
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
