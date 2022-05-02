import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from "@/layout/DashboardLayout.vue";
export const LOGIN_PATH = '/login'

const staticRoutes: RouteRecordRaw[] = [
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
]

const asyncRoutes: RouteRecordRaw[] = [
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
            title: '总览',
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
        path: '/system',
        component: Layout,
        meta: {
            hideInMenu: false,
            title: '系统管理',
            icon: 'folder-user-line'
        },
        children: [
            {
                path: '/system/user',
                name: 'user',
                meta: {
                    hideInMenu: false,
                    title: '用户管理',
                    icon: 'user-3-line'
                },
                component: () => import('@/views/system/user/index.vue')
            },
            {
                path: '/system/role',
                name: 'role',
                meta: {
                    hideInMenu: false,
                    title: '角色管理',
                    icon: 'role-3-line'
                },
                component: () => import('@/views/system/role/index.vue')
            },
            {
                path: '/system/permission',
                name: 'permission',
                meta: {
                    hideInMenu: false,
                    title: '权限管理',
                    icon: 'permission-3-line'
                },
                component: () => import('@/views/system/permission/index.vue')
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
            hideInMenu: true,
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
    },
];

export const routes = [...staticRoutes, ...asyncRoutes]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;