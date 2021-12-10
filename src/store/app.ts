import { defineStore } from "pinia";
import { staticRoutes, routes } from "@/router";
import { setVal, getVal, delHideMenu } from "@/utils/tools";
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
            routes: [...staticRoutes, ...routes]
        }
    },
    getters: {
        isOpend: (state) => !state.collapsed,
        sideMenu() {
            const all = delHideMenu(this.routes)
            return all
        }
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