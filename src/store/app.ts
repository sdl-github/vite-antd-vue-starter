import { defineStore } from "pinia";

export const appStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: "app",
    state: () => {
        return {
            collapsed: false,
            title: 'super admin',
            theme: 'dark',
            logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
            routes: []
        }
    },
    getters: {
        sidebar: (state) => state.collapsed
    },
    actions: {
        toggleCollapse() {
            this.collapsed = !this.collapsed
        }
    },
})