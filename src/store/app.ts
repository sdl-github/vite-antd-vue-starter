import { defineStore } from "pinia";
import {routes} from "@/router";

export const appStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: "app",
    state: () => {
        return {
            collapsed: false,
            title: 'remix admin',
            theme: 'dark',
            logo: '',
            routes
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