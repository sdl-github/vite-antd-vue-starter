import { removeToken } from "@/utils/auth";
import { defineStore } from "pinia";

export type IUserInfo = {
    username: string;
    avatar: string;
    email: string;
    phone: string;
}

export const userStore = defineStore({
    id: "user",
    state: () => {
        return {
            userInfo: {
                username: 'admin',
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
            }
        }
    },
    actions: {
        logout() {
            removeToken()
        }
    }
})