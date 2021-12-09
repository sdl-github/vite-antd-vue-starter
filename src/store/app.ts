import { defineStore } from "pinia";
import { routes } from "@/router";
import { setVal, getVal } from "@/utils/tools";

export const appStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: "app",
    state: () => {
        return {
            // false 打开 true 关闭
            collapsed: getVal('collapsed') === 'true' ? true : false,
            title: 'remix admin',
            theme: 'dark',
            logo: '',
            routes
        }
    },
    getters: {
        isOpend: (state) => !state.collapsed
    },
    actions: {
        toggleCollapse() {
            this.collapsed = !this.collapsed
            if (this.isOpend) {
                setVal('collapsed', 'false')
            } else {
                setVal('collapsed', 'true')
            }
        }
    },
})