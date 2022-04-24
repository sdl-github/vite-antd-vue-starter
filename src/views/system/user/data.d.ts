import type { ValueTypes } from "@/utils/graphql/zeus"

export type IUser = ValueTypes["User"] & { roles: ValueTypes["Role"][] }

export type IState = {
    pageNo: number,
    pageSize: number,
    dataList: IUser[],
    loading: boolean,
    modalVisible: boolean
}