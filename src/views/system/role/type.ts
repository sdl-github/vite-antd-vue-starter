
export type IPermission = {
    id: string,
    /** 角色名 */
    name?: string | null,
    /** 角色标识 */
    key?: string | null,
    /** 权限等级 */
    level?: number | null,
    /** 菜单ID */
    menuIds?: string[]
}