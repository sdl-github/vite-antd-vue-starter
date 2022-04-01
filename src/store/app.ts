import { defineStore } from "pinia";
export const appStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: "app",
    state: () => {
        return {
            title: 'super admin',
            theme: 'dark',
            logo: '@/assets/logo.png',
            collapsed: false
        }
    },
    getters: {
    },
    actions: {
        setCollapsed(collapsed: boolean) {
            this.collapsed = collapsed
        },

    },
})
