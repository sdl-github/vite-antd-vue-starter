import type { TableColumnType } from 'ant-design-vue'
import type { ModelTypes } from '@/utils/graphql/zeus'

export type Banner = ModelTypes['Banner']

export type CreateBannerInput = ModelTypes['CreateBannerInputInput']
export type FormModel = CreateBannerInput

export function generateFormModel(): FormModel {
  return {
    url: '',
    desc: '',
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
    title: '图片',
    align: 'center',
    width: '100px',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: '标题',
    width: '100px',
    align: 'center',
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: '操作',
    width: '100px',
    key: 'operation',
    fixed: 'right',
  },
]
