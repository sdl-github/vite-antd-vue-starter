import { mutation, query } from "@/utils/graphql"
import type { ValueTypes } from "@/utils/graphql/zeus"

export type QueryRoleInput = {
    id?: string,	/** 角色名 */
    name?: string,	/** 角色标识 */
    key?: string,	/** 是否默认标识 */
    isDefault?: boolean,	/** 开始时间YYYY-DD-MM */
    from?: string,	/** 结束时间YYYY-DD-MM */
    to?: string,	/** 是否默认标识 */
    includeMenu?: boolean,
    pageNo?: number,
    pageSize?: number
}

// 查询角色
export const queryRoleList = async (input?: QueryRoleInput) => {
    return query({
        getRoleList: [
            {
                ...input
            },
            {
                data: {
                    id: true,
                    level: true,
                    /** 创建时间 */
                    createdAt: true,
                    /** 更新时间 */
                    updatedAt: true,
                    /** 角色名 */
                    name: true,
                    /** 标识 */
                    key: true,
                    /** 是否默认 */
                    isDefault: true,
                    /** 权限菜单 */
                    menus: {
                        id: true,
                        name: true,
                    }

                },
                totalCount: true,
                hasNextPage: true,
            }
        ]
    })
}

// 编辑角色
export const updateRole = async (input: ValueTypes["EditRoleInput"]) => {
    return mutation({
        editRole: [
            { input },
            {
                code: true,
                msg: true,
            }
        ]
    })
}

// 创建角色
export const createRole = async (input: ValueTypes["CreateRoleInput"]) => {
    return mutation({
        createRole: [
            { input },
            {
                code: true,
                msg: true,
            }
        ]
    })
}

// 批量删除角色
export const delRoles = async (roleIds: string[]) => {
    return mutation({
        removeRoles: [
            { roleIds },
            {
                code: true,
                msg: true,
            }
        ]
    })
}