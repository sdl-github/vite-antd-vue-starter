import { mutation, query } from "@/utils/graphql"
import type { ValueTypes } from "@/utils/graphql/zeus"

export type UserQueryInput = {
    pageNo?: number;
    pageSize?: number;
    username?: string;
    id?: string;
    includeRole?: boolean;
    phone?: string;
    email?: string;
    from?: string;
    to?: string;
}

// 查询用户
export const queryUserPage = async (input?: UserQueryInput) => {
    return query({
        queryUserPage: [
            {
                ...input,
            },
            {
                data: {
                    id: true,
                    /** 创建时间 */
                    createdAt: true,
                    /** 更新时间 */
                    updatedAt: true,
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
                        id: true,
                        name: true,
                    }
                },
                hasNextPage: true,
                totalCount: true
            }
        ]
    })
}

// 创建用户
export const createUser = async (input: ValueTypes["CreateUserInput"]) => {
    return mutation({
        createUser: [
            {
                input
            },
            {
                code: true,
                msg: true
            }
        ]
    })
}

// 修改用户
export const editUser = async (input: ValueTypes["EditUserInput"]) => {
    return mutation({
        editUser: [
            {
                input
            },
            {
                code: true,
                msg: true
            }
        ]
    })
}

// 删除用户
export const delUsers = async (userIds: string[]) => {
    return mutation({
        removeUsers: [
            {
                userIds
            }, {
                code: true,
                msg: true
            }
        ]
    })
}