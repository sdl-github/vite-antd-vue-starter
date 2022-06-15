import router, { LOGIN_PATH } from "@/router/index";
import { appStore } from "@/store/app";
import { userStore } from "@/store/user";
import { getToken } from "@/utils/auth";
import { listToTree } from "@/utils/tools";
import NProgress from 'nprogress'
import { defineAsyncComponent } from "vue";
import Skeletion from '@/components/Skeleton.vue'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    if (getToken()) {
        if (to.path === LOGIN_PATH) {
            next({ path: '/' })
        }
        const user = userStore()
        const app = appStore()
        if (!user.userInfo.username) {
            await user.getMeInfo()
        }
        if (app.sideMenu.length === 0) {
            const asyncRoutes = buildMenu(user.userInfo.menus as any)
            asyncRoutes.forEach((item) => {
                router.addRoute(item)
            })
            app.setSideMenu(asyncRoutes)
            next({ ...to, replace: true })
        } else {
            next()
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next(`${LOGIN_PATH}?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach((to) => {
    // console.log('afterEach')
    NProgress.done()
})


function buildMenu(menus: any[]) {
    const list = menus.filter(item => item.type === 'MENU' && item.visible)
    const menuList = list.map(item => {
        const { component, name: title, icon, path } = item
        return {
            ...item,
            name: title,
            component: defineAsyncComponent({
                loader: () => import(/* @vite-ignore */`../${component}`),
                loadingComponent: Skeletion,
            }),
            meta: {
                title, icon
            }
        }
    })
    return listToTree(menuList, 'id', 'pId');
}