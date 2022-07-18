import { getAllMenuList } from "@/api/menu";
import router, { LOGIN_PATH } from "@/router/index";
import { appStore } from "@/store/app";
import { userStore } from "@/store/user";
import { getToken } from "@/utils/auth";
import { listToTree } from "@/utils/tools";
import NProgress from 'nprogress'
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
            // 所有菜单
            const {allMenuList} = await getAllMenuList()
            const asyncRoutes = buildMenu(allMenuList)
             // 添加到路由
            asyncRoutes.forEach((item) => {
                router.addRoute(item)
            })
            router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/system/404' })
            // 左侧菜单
            app.setSideMenu(filterMenu(user.userInfo.menus as any))
            next({ ...to, replace: true })
        } else {
            if(to.path === '/system/403' || to.path === '/system/404'){ 
                next()
            }
            if(!new Set(user.userInfo.menus?.map(item => item?.path)).has(to.path)){
                console.log('不在权限范围内', to.path)
                next({ path: '/system/403' })
            } else {
                console.log('在权限范围内', to.path)
                next()
            }
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
        const { name: title, icon } = item
        return {
            ...item,
            name: title,
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
        const { component, name: title, icon, path } = item
        return {
            ...item,
            name: title,
            component: modules[`../${component}.vue`],
            meta: {
                title, icon
            }
        }
    })
    return listToTree(menuList, 'id', 'pId');
}