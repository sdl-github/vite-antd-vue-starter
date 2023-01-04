import { loginAccount, logout, meInfo } from "@/api/auth";
import { removeToken, setToken } from "@/utils/auth";
import { ModelTypes } from "@/utils/graphql/zeus";
import { defineStore } from "pinia";
import { appStore } from "./app";

export type IUserInfo = ModelTypes["LoginUser"]

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
            this.userInfo = me as any
        },
        async logout() {
            const app = appStore()
            app.setSideMenu([])
            try {
                await logout()
            } catch (e) {
                console.log(e);
            } finally {
                this.userInfo = {} as any
                removeToken()
            }
        }
    }
})