import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from "@/layout/DashboardLayout.vue";
export const LOGIN_PATH = '/login'

declare module 'vue-router' {
    interface RouteMeta {
        // 是可选的
        hideInMenu?: boolean
        icon?: string
        // 每个路由都必须声明
        title: string
    }
}

const staticRoutes: RouteRecordRaw[] = [
    {
        path: LOGIN_PATH,
        component: () => import('@/views/login.vue'),
        meta: {
            title: 'login'
        }
    },

    {
        path: '/',
        redirect: '/dashboard/index',
        meta: {
            hideInMenu: true,
            title: 'index'
        }
    },
    {
        path: '/system',
        component: Layout,
        meta: {
            title: '系统管理',
        },
        children: [
            {
                path: '/system/userInfo',
                name: 'userInfo',
                meta: {
                    title: '我的信息',
                },
                component: () => import('@/views/system/userInfo/index.vue')
            },
            {
                path: '/system/404',
                name: '404',
                component: () => import('@/views/404.vue'),
                meta: {
                    title: '404'
                }
            },
            {
                path: '/system/403',
                name: '403',
                component: () => import('@/views/403.vue'),
                meta: {
                    title: '403'
                }
            },
        ]
    },
]


export const routes = [...staticRoutes]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;