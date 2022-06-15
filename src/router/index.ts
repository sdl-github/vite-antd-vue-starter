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
        path: '/',
        component: Layout,
        meta: {
            title: '总览',
            icon: 'dashboard-3-line'
        },
        children: [
            {
                path: '/dashboard/index',
                name: 'dashboard',
                meta: {
                    title: 'Dashboard',
                    icon: 'dashboard-3-line'
                },
                component: () => import('@/views/index.vue')
            }
        ]
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue'),
        meta: {
            title: '404'
        }
    },
]


export const routes = [...staticRoutes]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;