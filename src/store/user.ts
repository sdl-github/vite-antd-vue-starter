import { loginAccount, logout, meInfo } from "@/api/auth";
import { removeToken, setToken } from "@/utils/auth";
import { ValueTypes } from "@/utils/graphql/zeus";
import { defineStore } from "pinia";

export type IUserInfo = ValueTypes["LoginUser"]

export const userStore = defineStore({
    id: "user",
    state: () => {
        return {
            userInfo: {} as IUserInfo
        }
    },
    actions: {
        async login(username: string, password: string) {
            try {
                const { login: { data: { accessToken } } }: any = await loginAccount(username, password)
                setToken(accessToken);
                return true
            } catch (e) {
                return false;
            }
        },
        async getMeInfo() {
            const { me } = await meInfo()
            this.userInfo = me as IUserInfo
        },
        async logout() {
            try {
                await logout()
            } catch (e) {
                console.log(e);
            } finally {
                removeToken()
            }
        }
    }
})