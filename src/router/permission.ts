import router from "@/router/index";
import { appStore } from "@/store/app";
import { getToken } from "@/utils/auth";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/login', '/auth-redirect', '/bind', '/register']
router.beforeEach(async (to, from, next) => {
    NProgress.start()
    if(getToken()) {
        const store = appStore();
        // store.generateRoutes()
        // const routers = store.routes
        // routers.forEach((item) => {
        //     router.addRoute(item)
        // })
        // next({ ...to, replace: true })
        next()
    } else {
        // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
        NProgress.done()
      }
    } 
})

router.afterEach((to) => {
    // console.log('afterEach')
    NProgress.done()
})
