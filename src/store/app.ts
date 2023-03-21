import { defineStore } from "pinia";
export const appStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: "app",
    state: () => {
        return {
            title: 'Super Admin',
            theme: 'dark',
            logo: '',
            collapsed: false,
            sideMenu: []
        }
    },
    getters: {
    },
    actions: {
        setCollapsed(collapsed: boolean) {
            this.collapsed = collapsed
        },
        setSideMenu(sideMenu: any) {
            this.sideMenu = sideMenu
        }
    },
})
