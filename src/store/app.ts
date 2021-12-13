import { defineStore } from "pinia";
import { staticRoutes, asyncRoutes } from "@/router";
import { setVal, getVal, delHideMenu } from "@/utils/tools";
import { RouteRecordRaw } from "vue-router";
import path from 'path'
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
            routes: [...staticRoutes, ...asyncRoutes]
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
        },
        generateRoutes() {
            const finalRoutes = filterRoutes([...staticRoutes, ...asyncRoutes])
            console.log(finalRoutes);
            this.routes = finalRoutes
        }
    },
})

function filterRoutes(routes: RouteRecordRaw[], baseUrl = '/') {
    return routes.map((route) => {
        if (route.path !== '*') {
            route.path = path.resolve(baseUrl, route.path)
            // @ts-ignore
            route.fullPath = route.path
        }
        if (route.children) {
            // @ts-ignore
            route.children = filterRoutes(route.children, route.fullPath)
        }
        return route
    })
}