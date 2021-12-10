import { defineStore } from "pinia";

export type IUserInfo = {
    userName: string;
    avatar: string;
    email: string;
    phone: string;
}

export const userStore = defineStore({
    id: "user",
    state: () => {
        return {
            userInfo: {}
        }
    },
    actions: {
        logout() {
            
        }
    }
})