import router, { LOGIN_PATH } from "@/router/index";
import { userStore } from "@/store/user";
import { getToken } from "@/utils/auth";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/login', '/auth-redirect', '/bind', '/register']

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    if (getToken()) {
        const user = userStore()
        if (!user.userInfo.username) {
            await user.getMeInfo()
        }
        next()
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
