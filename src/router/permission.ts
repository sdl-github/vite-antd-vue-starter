import NProgress from 'nprogress'
import router from './index'

const whiteList = ['/login', '/register', '/oauth', '/bind', '/403', '/404', '/mock']
router.beforeEach(async (to, from, next) => {
  if (to.path !== from.path)
    NProgress.start()
  if (getToken()) {
    if (to.path === LOGIN_PATH)
      next({ path: '/' })

    const userStore = useUserStore()
    if (!userStore.user?.id)
      await userStore.init()

    const paths = userStore.user?.menus?.map(menu => menu?.path)
    if (whiteList.includes(to.path) || whiteList.includes(to.name as string) || to.meta.offAuth || paths?.includes(to.path))
      next()

    else
      next({ path: '/403' })
  }
  else {
  // 没有token
    if (whiteList.includes(to.path) || whiteList.includes(to.name as string)) {
    // 在免登录白名单，直接进入
      next()
    }
    else {
      next(`${LOGIN_PATH}?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
