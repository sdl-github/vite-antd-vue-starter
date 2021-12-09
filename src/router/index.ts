import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from "@/layout/index.vue";

// 定义路由
export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard/index',
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
            {
                path: '/example/icon',
                name: 'Remixicon',
                meta: {
                    hideInMenu: false,
                    title: 'icon',
                    icon: 'image-line'
                },
                component: () => import('@/views/icon/index.vue')
            }
        ]
    },
];

const router = createRouter({
    // hash 模式。
    history: createWebHashHistory(),
    routes
});

export default router;