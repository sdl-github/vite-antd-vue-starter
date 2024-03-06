import type { TableColumnType } from 'ant-design-vue'
import dayjs from 'dayjs'
import type { ModelTypes } from '@/utils/graphql/zeus'

export type QueryDoctorSchedulePageSpecificationInput = ModelTypes['QueryDoctorSchedulePageSpecificationInput']
export type DoctorSchedule = ModelTypes['DoctorSchedule']

export type CreateDoctorScheduleInput = ModelTypes['CreateDoctorScheduleInputInput']
export type UpdateDoctorScheduleInput = ModelTypes['updateDoctorScheduleInputInput']
export type FormModel = CreateDoctorScheduleInput & UpdateDoctorScheduleInput

export function generateFormModel(): FormModel {
  return {
    date: dayjs().format('YYYY-MM-DD'),
    shift: '',
    orgId: undefined,
    doctorId: undefined,
  }
}

export function generateSearch() {
  const search: QueryDoctorSchedulePageSpecificationInput = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    date: undefined,
    doctorName: '',
    orgName: '',
    sort: '',
  }
  return search
}
export interface State {
  loading: boolean
  modalVisible: boolean
  data: DoctorSchedule[]
  currentItem: DoctorSchedule | null
  search: QueryDoctorSchedulePageSpecificationInput
  total: number
}

export const columns: TableColumnType<DoctorSchedule>[] = [
  {
    title: '机构',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'org',
    key: 'org',
    ellipsis: true,
    sorter: true,
  },
  {
    title: '日期',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'date',
    key: 'date',
    ellipsis: true,
    sorter: true,
  },
  {
    title: '班次',
    align: 'center',
    width: '100px',
    dataIndex: 'shift',
    key: 'shift',
  },
  {
    title: '医生',
    width: '100px',
    align: 'center',
    dataIndex: 'doctor',
    key: 'doctor',
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
