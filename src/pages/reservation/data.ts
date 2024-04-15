import type { TableColumnType } from 'ant-design-vue'
import { type ModelTypes, type ValueTypes } from '@/utils/graphql/zeus'

export type QueryReservationPageSpecificationInput = ModelTypes['QueryReservationPageSpecificationInput']
export type Reservation = ModelTypes['Reservation']
export type CreateReservationInput = ModelTypes['CreateReservationInputInput']
export type UpdateReservationInput = ModelTypes['UpdateReservationInputInput']
export type FormModel = CreateReservationInput & UpdateReservationInput

export function generateFormModel(): FormModel {
  return {
    doctorId: '',
    scheduleId: '',
    orgId:'',
    appointmentDate: '',
    status:''
  }
}

export const ReservationStatusList = [
  {
    label: '0',
    value: "已预约",
  },
  {
    label: '1',
    value: "已完成",
  },
]

export const ReservationType = Object.fromEntries(
  ReservationStatusList.map(({ label, value }) => [value, label]),
)

export function generateSearch() {
  const search: QueryReservationPageSpecificationInput = {
    pageNo: DEFAULT_PAGE_NO,
    pageSize: DEFAULT_PAGE_SIZE,
    sort:'createdAt desc'
  }
  return search
}
export interface State {
  loading: boolean
  modalVisible: boolean
  data: Reservation[]
  currentItem: Reservation | null
  search: QueryReservationPageSpecificationInput
  total: number
}

export const columns: TableColumnType<Reservation>[] = [
  {
    title: '预约时间',
    fixed: 'left',
    align: 'center',
    width: '100px',
    dataIndex: 'appointmentDate',
    key: 'appointmentDate',
    ellipsis: true,
    sorter: true,
  },
  {
    title: '医生',
    align: 'center',
    width: '100px',
    dataIndex: 'doctorName',
    key: 'doctorName',
  },
  {
    title: '用户姓名',
    align: 'center',
    width: '100px',
    dataIndex: 'nickName',
    key: 'nickName',
  },
  {
    title: '医院名称',
    width: '100px',
    align: 'center',
    dataIndex: 'orgName',
    key: 'orgName',
  },
  {
    title: '地址',
    width: '100px',
    align: 'center',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '医生上班时间',
    width: '100px',
    align: 'center',
    dataIndex: 'shift',
    key: 'shift',
  },
  {
    title: '预约状态',
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
    title: '操作',
    width: '100px',
    key: 'operation',
    fixed: 'right',
  },

  
]
