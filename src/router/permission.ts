import NProgress from 'nprogress'
import router from '@/router/index'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === LOGIN_PATH) {
      next({ path: '/' })
    }
    const userStore = useUserStore()
    if (!userStore.user?.id) {
      await userStore.init()
    }
    next()
  }
  else {
    // 没有token
    if (whiteList.includes(to.path)) {
      // 在免登录白名单，直接进入
      next()
    }
    else {
      next(`${LOGIN_PATH}?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title as string || 'Super Admin'
  NProgress.done()
})
