import type { ModelTypes } from '@/utils/graphql/zeus'

export type IFile = ModelTypes['File']
export interface IState {
  pageNo: number
  pageSize: number
  total: number
  dataList: IFile[]
  loading: boolean
  modalVisible: boolean
  currentItem: IFile
  searchParams: {
    fileName: string
    originalName: string
    from: string
    to: string
  }
}
