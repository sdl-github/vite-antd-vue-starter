import {ModelTypes, ValueTypes} from "@/utils/graphql/zeus";

export type IUser = ModelTypes["User"]
export type ICreateUserInput = ValueTypes["CreateUserInput"]
export type IEditUserInput = ValueTypes["EditUserInput"]
export type IUserActionModal = ICreateUserInput & IEditUserInput
export type IState = {
    pageNo: number,
    pageSize: number,
    dataList: IUser[],
    loading: boolean,
    modalVisible: boolean,
    currentItem: IUser
}
