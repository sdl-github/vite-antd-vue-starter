import router from "@/router/index";
import { appStore } from "@/store/app";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    // console.log('beforeEach')
    const store = appStore();
    next();
})

router.afterEach((to) => {
    // console.log('afterEach')
    NProgress.done()
})
