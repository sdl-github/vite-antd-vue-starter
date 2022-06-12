import {mutation, query} from '@/utils/graphql';
import type {ValueTypes} from "@/utils/graphql/zeus"

type createMenuInput = ValueTypes["CreateMenuInput"];
type editMenuInput = ValueTypes["EditMenuInput"];

export type QueryMenuInput = {
    id?: string
    name?: string
    type?: string
    from?: string
    to?: string
}

export const queryMenuList = async (input?: QueryMenuInput) => {
    return query({
        getMenuList: [
            {
                ...input,
            },
            {
                totalCount: true,
                data: {
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
                    createdAt: true,
                    children: {}
                }
            }
        ]
    })
}

export const queryMenuTree = async (input?: QueryMenuInput) => {
    return query({
        getMenuTree: [{...input}, true]
    })
}

/**
 * 创建菜单
 * @param input
 * @returns
 */
export const createMenu = async (input: createMenuInput) => {
    return mutation({
        createMenu: [
            {
                input,
            },
            {code: true, msg: true},
        ],
    });
};

/**
 * 删除菜单
 * @param id
 */
export const deleteMenu = async (menuIds: string[]) => {
    return mutation({
        removeMenus: [
            {
                menuIds
            },
            {code: true, msg: true}
        ]
    })
};

/**
 * 修改菜单信息
 * @param input
 */
export const updateMenu = async (input: editMenuInput) => {
    return mutation({
        editMenu: [
            {
                input,
            },
            {
                code: true,
                msg: true,
            },
        ],
    });
};


