import router from "@/router/index";
import {appStore} from "@/store/app";

router.beforeEach(async (to, from, next) => {
    // console.log('beforeEach')
    const store = appStore();
    next();
})

router.afterEach((to) => {
    // console.log('afterEach')
})
