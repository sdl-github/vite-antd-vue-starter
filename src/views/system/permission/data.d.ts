import { ModelTypes, ValueTypes } from "@/utils/graphql/zeus";

export type IMenu = ModelTypes["Menu"]
export type ICreateMenuInput = ValueTypes["CreateMenuInput"]
export type IEditMenuInput = ValueTypes["EditMenuInput"]
export type IUserActionModal = ICreateMenuInput & IEditMenuInput
export type IState = {
    pageNo: number,
    pageSize: number,
    total: number,
    dataList: IMenu[],
    loading: boolean,
    modalVisible: boolean,
    currentItem: IMenu,
    searchParams: {
  
    }
}
