import { mutation, query } from "@/utils/graphql";

// 账号密码登录
export function loginAccount(username: string, password: string) {
    return mutation({
        login: [{
            username,
            password
        }, {
            code: true,
            msg: true,
            data: {
                accessToken: true
            }
        }]
    })
}

// 获取个人信息
export function meInfo() {
    return query({
        me: {
            id: true,
            /** 用户名 */
            username: true,
            /** 头像 */
            avatar: true,
            /** 性别 */
            gender: true,
            /** 邮箱 */
            email: true,
            /** 昵称 */
            nickname: true,
            /** 手机 */
            phone: true,
            /** 备注 */
            note: true,
            /** 角色 */
            roles: {
                name: true,
                key: true
            },
            menus: {
                id: true,
                name: true,
                orderBy: true,
                icon: true,
                path: true,
                pId: true,
                component: true,
                visible: true,
                type: true,
                permission: true,
            },
            /** 权限 */
            permissions: true,
            /** 管理员 */
            isSuperAdmin: true,
        }
    })
}

// 注销
export function logout() {
    return mutation({
        logout: {
            code: true,
            msg: true
        }
    })
}