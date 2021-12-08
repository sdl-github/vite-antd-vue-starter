import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import Layout from "@/layout/index.vue";

// 1.定义一些路由
export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
        meta: {
            hideInMenu: true,
            title: 'root'
        }
    },
    {
        path: '/dashboard',
        component: Layout,
        meta: {
            hideInMenu: false,
            title: 'Dashboard',
            icon: 'dashboard-3-line'
        },
        children: [
            {
                path: '/dashboard/index',
                name: 'index',
                meta: {
                    hideInMenu: false,
                    title: 'Dashboard',
                    icon: 'dashboard-3-line'
                },
                component: () => import('@/views/index.vue')
            }
        ]
    },
    {
        path: '/system',
        component: Layout,
        meta: {
            hideInMenu: false,
            title: '系统',
            icon: 'settings-5-line'
        },
        children: [
            {
                path: '/system/image',
                name: 'index',
                meta: {
                    hideInMenu: true,
                    title: '图片加载',
                    icon: 'image-line'
                },
                component: () => import('@/views/image/index.vue')
            }
        ]
    },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
});

export default router;