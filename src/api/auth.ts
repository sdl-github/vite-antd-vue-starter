import { mutation, query } from "@/utils/graphql";

// 账号密码登录
export function loginAccount(username: string, password: string) {
    return mutation({
        login: [{
            username,
            password
        }, {
            accessToken: true
        }]
    })
}

// 获取个人信息
export function queryUserInfo() {
    return query({
        userInfo: {
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

export function getOnLineUser(ip?: string, name?: string) {
    return query({
        getOnLineLoginUserList: [
            {
                ip,
                name
            }, {
                token: true,
                username: true,
                loginIp: true,
                loginTime: true,
                loginBrowser: true,
                loginAddr: true,
            }
        ]
    })
}

/**
 * 强制下线
 * @param token 
 * @returns 
 */
export function forceLogout(token: string) {
    return mutation({
        forceUserLogout: [
            { token },
            {
                code: true,
                msg: true
            }
        ]
    })
}