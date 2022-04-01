import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from "@/layout/DashboardLayout.vue";
export const LOGIN_PATH = '/login'

export const routes: RouteRecordRaw[] = [
    {
        path: LOGIN_PATH,
        component: () => import('@/views/login.vue'),
        meta: {
            hideInMenu: true,
            title: 'login'
        }
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue'),
        meta: {
            hideInMenu: true,
            title: '404'
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
                name: 'dashboard',
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
        path: '/example',
        component: Layout,
        meta: {
            hideInMenu: false,
            title: '例子',
            icon: 'settings-5-line'
        },
        children: [
            {
                path: '/example/image',
                name: 'index',
                meta: {
                    hideInMenu: false,
                    title: '图片加载',
                    icon: 'image-line'
                },
                component: () => import('@/views/image/index.vue')
            },
        ]
    },
    {
        path: '/error',
        component: Layout,
        meta: {
            hideInMenu: false,
            title: 'Error',
            icon: 'dashboard-3-line'
        },
        children: [
            {
                path: '/error/404',
                name: 'erroe',
                meta: {
                    hideInMenu: false,
                    title: '404',
                    icon: 'dashboard-3-line'
                },
                component: () => import('@/views/404.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;