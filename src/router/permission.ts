import { getAllMenuList } from "@/api/menu";
import router, { LOGIN_PATH } from "@/router/index";
import { appStore } from "@/stores/app";
import { userStore } from "@/stores/user";
import { getToken } from "@/utils/auth";
import { listToTree } from "@/utils/tools";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    // 登录状态
    if (getToken()) {
        // 登录状态去往登录页 直接跳转首页  重新beforeEach
        if (to.path === LOGIN_PATH) {
            next({ path: '/' })
        }
        const user = userStore()
        const app = appStore()
        // 用户信息未获取 获取信息
        if (!user.userInfo.username) {
            await user.queryUserInfo()
        }
        // 用户菜单未构造
        if (app.sideMenu.length === 0) {
            // 所有菜单接口
            const { queryMenuList } = await getAllMenuList(true)
            // 数组转树结构
            const asyncRoutes = buildMenu(queryMenuList)
            // 添加到vue路由
            asyncRoutes.forEach((item) => {
                router.addRoute(item)
            })
            // 最后添加404页面
            router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/system/404' })
            // 设置左侧菜单
            app.setSideMenu(filterMenu(queryMenuList))
            // 确保addRoutes()时动态添加的路由已经被完全加载上去 否则重新beforeEach
            next({ ...to, replace: true })
        } else {
            // 如果跳转403 404 放行
            if (to.path === '/system/403' || to.path === '/system/404') {
                next()
            }
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
    document.title = to.meta.title || 'Super Admin'
    NProgress.done()
})

function filterMenu(menus: any[]) {
    const list = menus.filter(item => item.type === 'MENU' && item.visible).map(item => {
        const { title: t, name, icon } = item
        const title = t || name
        return {
            ...item,
            title,
            meta: {
                title, icon
            }
        }
    })
    return listToTree(list, 'id', 'pId');
}

function buildMenu(menus: any[]) {
    const modules = import.meta.glob('../**/*.vue')
    const list = menus.filter(item => item.type === 'MENU')
    const menuList = list.map(item => {
        const { component, title: t, name, icon } = item
        const title = t || name
        return {
            ...item,
            title,
            component: modules[`../${component}.vue`],
            meta: {
                title, icon
            }
        }
    })
    return listToTree(menuList, 'id', 'pId');
}