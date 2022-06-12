/* eslint-disable */

import { AllTypesProps, ReturnTypes } from './const';
type ZEUS_INTERFACES = GraphQLTypes["BaseResult"]
type ZEUS_UNIONS = never

export type ValueTypes = {
    ["Query"]: AliasType<{
hello?: [{	name:string},boolean],
	/** 获取我的信息 */
	me?:ValueTypes["LoginUser"],
getMenuTree?: [{	/** 角色id */
	id?:string | null,	/** 类型 */
	type?:string | null,	/** 角色名 */
	name?:string | null,	/** 是否可见 */
	visible?:boolean | null,	/** 开始时间YYYY-DD-MM */
	from?:string | null,	/** 结束时间YYYY-DD-MM */
	to?:string | null},boolean],
getMenuList?: [{	/** 角色id */
	id?:string | null,	/** 类型 */
	type?:string | null,	/** 角色名 */
	name?:string | null,	/** 是否可见 */
	visible?:boolean | null,	/** 开始时间YYYY-DD-MM */
	from?:string | null,	/** 结束时间YYYY-DD-MM */
	to?:string | null,	pageNo?:number | null,	pageSize?:number | null},ValueTypes["MenuPageResult"]],
getRoleList?: [{	/** 角色id */
	id?:string | null,	/** 角色名 */
	name?:string | null,	/** 角色标识 */
	key?:string | null,	/** 是否默认标识 */
	isDefault?:boolean | null,	/** 开始时间YYYY-DD-MM */
	from?:string | null,	/** 结束时间YYYY-DD-MM */
	to?:string | null,	/** 是否默认标识 */
	includeMenu?:boolean | null,	pageNo?:number | null,	pageSize?:number | null},ValueTypes["RolePageResult"]],
getUserList?: [{	/** 用户id */
	id?:string | null,	/** 用户名 */
	username?:string | null,	/** 用户手机 */
	phone?:string | null,	/** 邮箱 */
	email?:string | null,	/** 开始时间YYYY-DD-MM */
	from?:string | null,	/** 结束时间YYYY-DD-MM */
	to?:string | null,	/** 是否包含角色 */
	includeRole?:boolean | null,	pageNo?:number | null,	pageSize?:number | null},ValueTypes["UserPageResult"]],
		__typename?: boolean
}>;
	["LoginUser"]: AliasType<{
	id?:boolean,
	/** 创建时间 */
	createdAt?:boolean,
	/** 更新时间 */
	updatedAt?:boolean,
	/** 用户名 */
	username?:boolean,
	/** 头像 */
	avatar?:boolean,
	/** 性别 */
	gender?:boolean,
	/** 邮箱 */
	email?:boolean,
	/** 昵称 */
	nickname?:boolean,
	/** 手机 */
	phone?:boolean,
	/** 备注 */
	note?:boolean,
	/** 角色 */
	roles?:ValueTypes["Role"],
	/** 登录时间 */
	loginTime?:boolean,
	/** 菜单 */
	menus?:ValueTypes["Menu"],
	/** 权限 */
	permissions?:boolean,
	/** 管理员 */
	isSuperAdmin?:boolean,
		__typename?: boolean
}>;
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
["DateTime"]:unknown;
	/** 用户性别枚举 */
["UserGenderEnum"]:UserGenderEnum;
	["Role"]: AliasType<{
	id?:boolean,
	/** 创建时间 */
	createdAt?:boolean,
	/** 更新时间 */
	updatedAt?:boolean,
	/** 角色名 */
	name?:boolean,
	/** 角色level */
	level?:boolean,
	/** 标识 */
	key?:boolean,
	/** 是否默认 */
	isDefault?:boolean,
	/** 权限菜单 */
	menus?:ValueTypes["Menu"],
		__typename?: boolean
}>;
	["Menu"]: AliasType<{
	id?:boolean,
	/** 创建时间 */
	createdAt?:boolean,
	/** 更新时间 */
	updatedAt?:boolean,
	/** 菜单名 */
	name?:boolean,
	/** 图标 */
	icon?:boolean,
	/** 上级ID */
	pId?:boolean,
	/** 排序 */
	orderBy?:boolean,
	/** 路径 */
	path?:boolean,
	/** 组件 */
	component?:boolean,
	/** 可见 */
	visible?:boolean,
	/** 权限字符 */
	permission?:boolean,
	/** 类型 */
	type?:boolean,
	/** children */
	children?:ValueTypes["Menu"],
		__typename?: boolean
}>;
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:unknown;
	["MenuPageResult"]: AliasType<{
	data?:ValueTypes["Menu"],
	totalCount?:boolean,
	hasNextPage?:boolean,
		__typename?: boolean
}>;
	["RolePageResult"]: AliasType<{
	data?:ValueTypes["Role"],
	totalCount?:boolean,
	hasNextPage?:boolean,
		__typename?: boolean
}>;
	["UserPageResult"]: AliasType<{
	data?:ValueTypes["User"],
	totalCount?:boolean,
	hasNextPage?:boolean,
		__typename?: boolean
}>;
	["User"]: AliasType<{
	id?:boolean,
	/** 创建时间 */
	createdAt?:boolean,
	/** 更新时间 */
	updatedAt?:boolean,
	/** 用户名 */
	username?:boolean,
	/** 头像 */
	avatar?:boolean,
	/** 性别 */
	gender?:boolean,
	/** 邮箱 */
	email?:boolean,
	/** 昵称 */
	nickname?:boolean,
	/** 手机 */
	phone?:boolean,
	/** 备注 */
	note?:boolean,
	/** 角色 */
	roles?:ValueTypes["Role"],
		__typename?: boolean
}>;
	["Mutation"]: AliasType<{
login?: [{	password:string,	username:string},ValueTypes["LoginResult"]],
	logout?:ValueTypes["BaseResponse"],
createMenu?: [{	input:ValueTypes["CreateMenuInput"]},ValueTypes["BaseResponse"]],
editMenu?: [{	input:ValueTypes["EditMenuInput"]},ValueTypes["BaseResponse"]],
removeMenus?: [{	menuIds:string[]},ValueTypes["BaseResponse"]],
createRole?: [{	input:ValueTypes["CreateRoleInput"]},ValueTypes["BaseResponse"]],
editRole?: [{	input:ValueTypes["EditRoleInput"]},ValueTypes["BaseResponse"]],
removeRoles?: [{	roleIds:string[]},ValueTypes["BaseResponse"]],
createUser?: [{	input:ValueTypes["CreateUserInput"]},ValueTypes["BaseResponse"]],
editUser?: [{	input:ValueTypes["EditUserInput"]},ValueTypes["BaseResponse"]],
removeUsers?: [{	userIds:string[]},ValueTypes["BaseResponse"]],
resetUserPassword?: [{	userId:string},ValueTypes["BaseResponse"]],
		__typename?: boolean
}>;
	["LoginResult"]: AliasType<{
	/** code */
	code?:boolean,
	/** msg */
	msg?:boolean,
	/** data */
	data?:ValueTypes["LoginType"],
		__typename?: boolean
}>;
	["LoginType"]: AliasType<{
	/** accessToken */
	accessToken?:boolean,
		__typename?: boolean
}>;
	["BaseResponse"]: AliasType<{
	code?:boolean,
	msg?:boolean,
		__typename?: boolean
}>;
	["BaseResult"]:AliasType<{
		code?:boolean,
	msg?:boolean;
		['...on BaseResponse']?: Omit<ValueTypes["BaseResponse"],keyof ValueTypes["BaseResult"]>;
		__typename?: boolean
}>;
	["CreateMenuInput"]: {
	/** 菜单名 */
	name:string,
	/** 图标 */
	icon?:string | null,
	/** 上级ID */
	pId?:string | null,
	/** 排序 */
	orderBy?:number | null,
	/** 路径 */
	path?:string | null,
	/** 组件 */
	component?:string | null,
	/** 可见 */
	visible?:boolean | null,
	/** 权限字符 */
	permission?:string | null,
	/** 类型 */
	type?:string | null
};
	["EditMenuInput"]: {
	/** id */
	id:string,
	/** 菜单名 */
	name?:string | null,
	/** 图标 */
	icon?:string | null,
	/** 上级ID */
	pId?:string | null,
	/** 排序 */
	orderBy?:number | null,
	/** 路径 */
	path?:string | null,
	/** 组件 */
	component?:string | null,
	/** 可见 */
	visible?:boolean | null,
	/** 权限字符 */
	permission?:string | null,
	/** 类型 */
	type?:string | null
};
	["CreateRoleInput"]: {
	/** 角色名 */
	name:string,
	/** 角色标识 */
	key:string,
	/** 权限等级 */
	level:number,
	/** 菜单ID */
	menuIds?:string[]
};
	["EditRoleInput"]: {
	/** 角色id */
	id:string,
	/** 角色名 */
	name?:string | null,
	/** 角色标识 */
	key?:string | null,
	/** 权限等级 */
	level?:number | null,
	/** 菜单ID */
	menuIds?:string[]
};
	["CreateUserInput"]: {
	/** 用户名 */
	username:string,
	/** 头像 */
	avatar?:string | null,
	/** 密码 */
	password:string,
	/** 性别 */
	gender?:ValueTypes["UserGenderEnum"] | null,
	/** 邮箱 */
	email?:string | null,
	/** 昵称 */
	nickname?:string | null,
	/** 手机 */
	phone?:string | null,
	/** 备注 */
	note?:string | null,
	/** 角色 */
	roleIds?:string[]
};
	["EditUserInput"]: {
	/** 角色id */
	id:string,
	/** 头像 */
	avatar?:string | null,
	/** 性别 */
	gender?:ValueTypes["UserGenderEnum"] | null,
	/** 邮箱 */
	email?:string | null,
	/** 昵称 */
	nickname?:string | null,
	/** 手机 */
	phone?:string | null,
	/** 备注 */
	note?:string | null,
	/** 角色 */
	roleIds?:string[]
}
  }

export type ModelTypes = {
    ["Query"]: {
		hello:string,
	/** 获取我的信息 */
	me:ModelTypes["LoginUser"],
	/** 菜单Tree查询 */
	getMenuTree:ModelTypes["JSONObject"][],
	/** 菜单列表查询 */
	getMenuList:ModelTypes["MenuPageResult"],
	/** 角色列表查询 */
	getRoleList:ModelTypes["RolePageResult"],
	/** 角色列表查询 */
	getUserList:ModelTypes["UserPageResult"]
};
	["LoginUser"]: {
		id:string,
	/** 创建时间 */
	createdAt?:ModelTypes["DateTime"],
	/** 更新时间 */
	updatedAt?:ModelTypes["DateTime"],
	/** 用户名 */
	username:string,
	/** 头像 */
	avatar?:string,
	/** 性别 */
	gender?:ModelTypes["UserGenderEnum"],
	/** 邮箱 */
	email?:string,
	/** 昵称 */
	nickname?:string,
	/** 手机 */
	phone?:string,
	/** 备注 */
	note?:string,
	/** 角色 */
	roles?:(ModelTypes["Role"] | undefined)[],
	/** 登录时间 */
	loginTime?:ModelTypes["DateTime"],
	/** 菜单 */
	menus?:(ModelTypes["Menu"] | undefined)[],
	/** 权限 */
	permissions?:(string | undefined)[],
	/** 管理员 */
	isSuperAdmin?:boolean
};
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
["DateTime"]:any;
	/** 用户性别枚举 */
["UserGenderEnum"]: GraphQLTypes["UserGenderEnum"];
	["Role"]: {
		id:string,
	/** 创建时间 */
	createdAt?:ModelTypes["DateTime"],
	/** 更新时间 */
	updatedAt?:ModelTypes["DateTime"],
	/** 角色名 */
	name:string,
	/** 角色level */
	level:number,
	/** 标识 */
	key?:string,
	/** 是否默认 */
	isDefault?:boolean,
	/** 权限菜单 */
	menus?:(ModelTypes["Menu"] | undefined)[]
};
	["Menu"]: {
		id:string,
	/** 创建时间 */
	createdAt?:ModelTypes["DateTime"],
	/** 更新时间 */
	updatedAt?:ModelTypes["DateTime"],
	/** 菜单名 */
	name:string,
	/** 图标 */
	icon?:string,
	/** 上级ID */
	pId?:string,
	/** 排序 */
	orderBy?:number,
	/** 路径 */
	path?:string,
	/** 组件 */
	component?:string,
	/** 可见 */
	visible?:boolean,
	/** 权限字符 */
	permission?:string,
	/** 类型 */
	type?:string,
	/** children */
	children?:(ModelTypes["Menu"] | undefined)[]
};
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:any;
	["MenuPageResult"]: {
		data?:ModelTypes["Menu"][],
	totalCount:number,
	hasNextPage:boolean
};
	["RolePageResult"]: {
		data?:ModelTypes["Role"][],
	totalCount:number,
	hasNextPage:boolean
};
	["UserPageResult"]: {
		data?:ModelTypes["User"][],
	totalCount:number,
	hasNextPage:boolean
};
	["User"]: {
		id:string,
	/** 创建时间 */
	createdAt?:ModelTypes["DateTime"],
	/** 更新时间 */
	updatedAt?:ModelTypes["DateTime"],
	/** 用户名 */
	username:string,
	/** 头像 */
	avatar?:string,
	/** 性别 */
	gender?:ModelTypes["UserGenderEnum"],
	/** 邮箱 */
	email?:string,
	/** 昵称 */
	nickname?:string,
	/** 手机 */
	phone?:string,
	/** 备注 */
	note?:string,
	/** 角色 */
	roles?:(ModelTypes["Role"] | undefined)[]
};
	["Mutation"]: {
		login:ModelTypes["LoginResult"],
	logout:ModelTypes["BaseResponse"],
	/** 创建新菜单 */
	createMenu:ModelTypes["BaseResponse"],
	/** 修改菜单信息 */
	editMenu:ModelTypes["BaseResponse"],
	/** 批量删除用户 */
	removeMenus:ModelTypes["BaseResponse"],
	/** 新增角色 */
	createRole:ModelTypes["BaseResponse"],
	/** 修改角色 */
	editRole:ModelTypes["BaseResponse"],
	/** 批量删除角色 */
	removeRoles:ModelTypes["BaseResponse"],
	/** 创建新用户 */
	createUser:ModelTypes["BaseResponse"],
	/** 修改用户信息 */
	editUser:ModelTypes["BaseResponse"],
	/** 批量删除用户 */
	removeUsers:ModelTypes["BaseResponse"],
	/** 重置用户密码 */
	resetUserPassword:ModelTypes["BaseResponse"]
};
	["LoginResult"]: {
		/** code */
	code?:number,
	/** msg */
	msg?:string,
	/** data */
	data?:ModelTypes["LoginType"]
};
	["LoginType"]: {
		/** accessToken */
	accessToken:string
};
	["BaseResponse"]: {
		code:number,
	msg:string
};
	["BaseResult"]: ModelTypes["BaseResponse"];
	["CreateMenuInput"]: GraphQLTypes["CreateMenuInput"];
	["EditMenuInput"]: GraphQLTypes["EditMenuInput"];
	["CreateRoleInput"]: GraphQLTypes["CreateRoleInput"];
	["EditRoleInput"]: GraphQLTypes["EditRoleInput"];
	["CreateUserInput"]: GraphQLTypes["CreateUserInput"];
	["EditUserInput"]: GraphQLTypes["EditUserInput"]
    }

export type GraphQLTypes = {
    ["Query"]: {
	__typename: "Query",
	hello: string,
	/** 获取我的信息 */
	me: GraphQLTypes["LoginUser"],
	/** 菜单Tree查询 */
	getMenuTree: Array<GraphQLTypes["JSONObject"]>,
	/** 菜单列表查询 */
	getMenuList: GraphQLTypes["MenuPageResult"],
	/** 角色列表查询 */
	getRoleList: GraphQLTypes["RolePageResult"],
	/** 角色列表查询 */
	getUserList: GraphQLTypes["UserPageResult"]
};
	["LoginUser"]: {
	__typename: "LoginUser",
	id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"],
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"],
	/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"],
	/** 邮箱 */
	email?: string,
	/** 昵称 */
	nickname?: string,
	/** 手机 */
	phone?: string,
	/** 备注 */
	note?: string,
	/** 角色 */
	roles?: Array<GraphQLTypes["Role"] | undefined>,
	/** 登录时间 */
	loginTime?: GraphQLTypes["DateTime"],
	/** 菜单 */
	menus?: Array<GraphQLTypes["Menu"] | undefined>,
	/** 权限 */
	permissions?: Array<string | undefined>,
	/** 管理员 */
	isSuperAdmin?: boolean
};
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
["DateTime"]:any;
	/** 用户性别枚举 */
["UserGenderEnum"]: UserGenderEnum;
	["Role"]: {
	__typename: "Role",
	id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"],
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"],
	/** 角色名 */
	name: string,
	/** 角色level */
	level: number,
	/** 标识 */
	key?: string,
	/** 是否默认 */
	isDefault?: boolean,
	/** 权限菜单 */
	menus?: Array<GraphQLTypes["Menu"] | undefined>
};
	["Menu"]: {
	__typename: "Menu",
	id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"],
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"],
	/** 菜单名 */
	name: string,
	/** 图标 */
	icon?: string,
	/** 上级ID */
	pId?: string,
	/** 排序 */
	orderBy?: number,
	/** 路径 */
	path?: string,
	/** 组件 */
	component?: string,
	/** 可见 */
	visible?: boolean,
	/** 权限字符 */
	permission?: string,
	/** 类型 */
	type?: string,
	/** children */
	children?: Array<GraphQLTypes["Menu"] | undefined>
};
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:any;
	["MenuPageResult"]: {
	__typename: "MenuPageResult",
	data?: Array<GraphQLTypes["Menu"]>,
	totalCount: number,
	hasNextPage: boolean
};
	["RolePageResult"]: {
	__typename: "RolePageResult",
	data?: Array<GraphQLTypes["Role"]>,
	totalCount: number,
	hasNextPage: boolean
};
	["UserPageResult"]: {
	__typename: "UserPageResult",
	data?: Array<GraphQLTypes["User"]>,
	totalCount: number,
	hasNextPage: boolean
};
	["User"]: {
	__typename: "User",
	id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"],
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"],
	/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"],
	/** 邮箱 */
	email?: string,
	/** 昵称 */
	nickname?: string,
	/** 手机 */
	phone?: string,
	/** 备注 */
	note?: string,
	/** 角色 */
	roles?: Array<GraphQLTypes["Role"] | undefined>
};
	["Mutation"]: {
	__typename: "Mutation",
	login: GraphQLTypes["LoginResult"],
	logout: GraphQLTypes["BaseResponse"],
	/** 创建新菜单 */
	createMenu: GraphQLTypes["BaseResponse"],
	/** 修改菜单信息 */
	editMenu: GraphQLTypes["BaseResponse"],
	/** 批量删除用户 */
	removeMenus: GraphQLTypes["BaseResponse"],
	/** 新增角色 */
	createRole: GraphQLTypes["BaseResponse"],
	/** 修改角色 */
	editRole: GraphQLTypes["BaseResponse"],
	/** 批量删除角色 */
	removeRoles: GraphQLTypes["BaseResponse"],
	/** 创建新用户 */
	createUser: GraphQLTypes["BaseResponse"],
	/** 修改用户信息 */
	editUser: GraphQLTypes["BaseResponse"],
	/** 批量删除用户 */
	removeUsers: GraphQLTypes["BaseResponse"],
	/** 重置用户密码 */
	resetUserPassword: GraphQLTypes["BaseResponse"]
};
	["LoginResult"]: {
	__typename: "LoginResult",
	/** code */
	code?: number,
	/** msg */
	msg?: string,
	/** data */
	data?: GraphQLTypes["LoginType"]
};
	["LoginType"]: {
	__typename: "LoginType",
	/** accessToken */
	accessToken: string
};
	["BaseResponse"]: {
	__typename: "BaseResponse",
	code: number,
	msg: string
};
	["BaseResult"]: {
	__typename:"BaseResponse",
	code: number,
	msg: string
	['...on BaseResponse']: '__union' & GraphQLTypes["BaseResponse"];
};
	["CreateMenuInput"]: {
		/** 菜单名 */
	name: string,
	/** 图标 */
	icon?: string,
	/** 上级ID */
	pId?: string,
	/** 排序 */
	orderBy?: number,
	/** 路径 */
	path?: string,
	/** 组件 */
	component?: string,
	/** 可见 */
	visible?: boolean,
	/** 权限字符 */
	permission?: string,
	/** 类型 */
	type?: string
};
	["EditMenuInput"]: {
		/** id */
	id: string,
	/** 菜单名 */
	name?: string,
	/** 图标 */
	icon?: string,
	/** 上级ID */
	pId?: string,
	/** 排序 */
	orderBy?: number,
	/** 路径 */
	path?: string,
	/** 组件 */
	component?: string,
	/** 可见 */
	visible?: boolean,
	/** 权限字符 */
	permission?: string,
	/** 类型 */
	type?: string
};
	["CreateRoleInput"]: {
		/** 角色名 */
	name: string,
	/** 角色标识 */
	key: string,
	/** 权限等级 */
	level: number,
	/** 菜单ID */
	menuIds?: Array<string>
};
	["EditRoleInput"]: {
		/** 角色id */
	id: string,
	/** 角色名 */
	name?: string,
	/** 角色标识 */
	key?: string,
	/** 权限等级 */
	level?: number,
	/** 菜单ID */
	menuIds?: Array<string>
};
	["CreateUserInput"]: {
		/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string,
	/** 密码 */
	password: string,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"],
	/** 邮箱 */
	email?: string,
	/** 昵称 */
	nickname?: string,
	/** 手机 */
	phone?: string,
	/** 备注 */
	note?: string,
	/** 角色 */
	roleIds?: Array<string>
};
	["EditUserInput"]: {
		/** 角色id */
	id: string,
	/** 头像 */
	avatar?: string,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"],
	/** 邮箱 */
	email?: string,
	/** 昵称 */
	nickname?: string,
	/** 手机 */
	phone?: string,
	/** 备注 */
	note?: string,
	/** 角色 */
	roleIds?: Array<string>
}
    }
/** 用户性别枚举 */
export const enum UserGenderEnum {
	UNKNOWN = "UNKNOWN",
	MALE = "MALE",
	FEMALE = "FEMALE"
}
export class GraphQLError extends Error {
    constructor(public response: GraphQLResponse) {
      super("");
      console.error(response);
    }
    toString() {
      return "GraphQL Response Error";
    }
  }


export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<
  UnwrapPromise<ReturnType<T>>
>;
export type ZeusHook<
  T extends (
    ...args: any[]
  ) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>
> = ZeusState<ReturnType<T>[N]>;

type WithTypeNameValue<T> = T & {
  __typename?: boolean;
};
type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
type IsArray<T, U> = T extends Array<infer R> ? InputType<R, U>[] : InputType<T, U>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;

type IsInterfaced<SRC extends DeepAnify<DST>, DST> = FlattenArray<SRC> extends ZEUS_INTERFACES | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P]>
          : {}
        : never;
    }[keyof DST] &
      {
        [P in keyof Omit<
          Pick<
            SRC,
            {
              [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
            }[keyof DST]
          >,
          '__typename'
        >]: IsPayLoad<DST[P]> extends boolean ? SRC[P] : IsArray<SRC[P], DST[P]>;
      }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends boolean ? SRC[P] : IsArray<SRC[P], DST[P]>;
    };

export type MapType<SRC, DST> = SRC extends DeepAnify<DST> ? IsInterfaced<SRC, DST> : never;
export type InputType<SRC, DST> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P]>;
    } &
      MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>>
  : MapType<SRC, IsPayLoad<DST>>;
type Func<P extends any[], R> = (...args: P) => R;
type AnyFunc = Func<any, any>;
export type ArgsType<F extends AnyFunc> = F extends Func<infer P, any> ? P : never;
export type OperationOptions = {
  variables?: Record<string, any>;
  operationName?: string;
};
export type SubscriptionToGraphQL<Z, T> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z>; errors?: string[] }) => void) => void;
  open: () => void;
};
export type SelectionFunction<V> = <T>(t: T | V) => T;
export type fetchOptions = ArgsType<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (
  ...args: infer R
) => WebSocket
  ? R
  : never;
export type chainOptions =
  | [fetchOptions[0], fetchOptions[1] & {websocket?: websocketOptions}]
  | [fetchOptions[0]];
export type FetchFunction = (
  query: string,
  variables?: Record<string, any>,
) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;



export const ZeusSelect = <T>() => ((t: any) => t) as SelectionFunction<T>;

export const ScalarResolver = (scalar: string, value: any) => {
  switch (scalar) {
    case 'String':
      return  `${JSON.stringify(value)}`;
    case 'Int':
      return `${value}`;
    case 'Float':
      return `${value}`;
    case 'Boolean':
      return `${value}`;
    case 'ID':
      return `"${value}"`;
    case 'enum':
      return `${value}`;
    case 'scalar':
      return `${value}`;
    default:
      return false;
  }
};


export const TypesPropsResolver = ({
    value,
    type,
    name,
    key,
    blockArrays
}: {
    value: any;
    type: string;
    name: string;
    key?: string;
    blockArrays?: boolean;
}): string => {
    if (value === null) {
        return `null`;
    }
    let resolvedValue = AllTypesProps[type][name];
    if (key) {
        resolvedValue = resolvedValue[key];
    }
    if (!resolvedValue) {
        throw new Error(`Cannot resolve ${type} ${name}${key ? ` ${key}` : ''}`)
    }
    const typeResolved = resolvedValue.type;
    const isArray = resolvedValue.array;
    const isArrayRequired = resolvedValue.arrayRequired;
    if (typeof value === 'string' && value.startsWith(`ZEUS_VAR$`)) {
        const isRequired = resolvedValue.required ? '!' : '';
        let t = `${typeResolved}`;
        if (isArray) {
          if (isRequired) {
              t = `${t}!`;
          }
          t = `[${t}]`;
          if(isArrayRequired){
            t = `${t}!`;
          }
        }else{
          if (isRequired) {
                t = `${t}!`;
          }
        }
        return `\$${value.split(`ZEUS_VAR$`)[1]}__ZEUS_VAR__${t}`;
    }
    if (isArray && !blockArrays) {
        return `[${value
        .map((v: any) => TypesPropsResolver({ value: v, type, name, key, blockArrays: true }))
        .join(',')}]`;
    }
    const reslovedScalar = ScalarResolver(typeResolved, value);
    if (!reslovedScalar) {
        const resolvedType = AllTypesProps[typeResolved];
        if (typeof resolvedType === 'object') {
        const argsKeys = Object.keys(resolvedType);
        return `{${argsKeys
            .filter((ak) => value[ak] !== undefined)
            .map(
            (ak) => `${ak}:${TypesPropsResolver({ value: value[ak], type: typeResolved, name: ak })}`
            )}}`;
        }
        return ScalarResolver(AllTypesProps[typeResolved], value) as string;
    }
    return reslovedScalar;
};


const isArrayFunction = (
  parent: string[],
  a: any[]
) => {
  const [values, r] = a;
  const [mainKey, key, ...keys] = parent;
  const keyValues = Object.keys(values).filter((k) => typeof values[k] !== 'undefined');

  if (!keys.length) {
      return keyValues.length > 0
        ? `(${keyValues
            .map(
              (v) =>
                `${v}:${TypesPropsResolver({
                  value: values[v],
                  type: mainKey,
                  name: key,
                  key: v
                })}`
            )
            .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
        : traverseToSeekArrays(parent, r);
    }

  const [typeResolverKey] = keys.splice(keys.length - 1, 1);
  let valueToResolve = ReturnTypes[mainKey][key];
  for (const k of keys) {
    valueToResolve = ReturnTypes[valueToResolve][k];
  }

  const argumentString =
    keyValues.length > 0
      ? `(${keyValues
          .map(
            (v) =>
              `${v}:${TypesPropsResolver({
                value: values[v],
                type: valueToResolve,
                name: typeResolverKey,
                key: v
              })}`
          )
          .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
      : traverseToSeekArrays(parent, r);
  return argumentString;
};


const resolveKV = (k: string, v: boolean | string | { [x: string]: boolean | string }) =>
  typeof v === 'boolean' ? k : typeof v === 'object' ? `${k}{${objectToTree(v)}}` : `${k}${v}`;


const objectToTree = (o: { [x: string]: boolean | string }): string =>
  `{${Object.keys(o).map((k) => `${resolveKV(k, o[k])}`).join(' ')}}`;


const traverseToSeekArrays = (parent: string[], a?: any): string => {
  if (!a) return '';
  if (Object.keys(a).length === 0) {
    return '';
  }
  let b: Record<string, any> = {};
  if (Array.isArray(a)) {
    return isArrayFunction([...parent], a);
  } else {
    if (typeof a === 'object') {
      Object.keys(a)
        .filter((k) => typeof a[k] !== 'undefined')
        .forEach((k) => {
        if (k === '__alias') {
          Object.keys(a[k]).forEach((aliasKey) => {
            const aliasOperations = a[k][aliasKey];
            const aliasOperationName = Object.keys(aliasOperations)[0];
            const aliasOperation = aliasOperations[aliasOperationName];
            b[
              `${aliasOperationName}__alias__${aliasKey}: ${aliasOperationName}`
            ] = traverseToSeekArrays([...parent, aliasOperationName], aliasOperation);
          });
        } else {
          b[k] = traverseToSeekArrays([...parent, k], a[k]);
        }
      });
    } else {
      return '';
    }
  }
  return objectToTree(b);
};  


const buildQuery = (type: string, a?: Record<any, any>) => 
  traverseToSeekArrays([type], a);


const inspectVariables = (query: string) => {
  const regex = /\$\b\w*__ZEUS_VAR__\[?[^!^\]^\s^,^\)^\}]*[!]?[\]]?[!]?/g;
  let result;
  const AllVariables: string[] = [];
  while ((result = regex.exec(query))) {
    if (AllVariables.includes(result[0])) {
      continue;
    }
    AllVariables.push(result[0]);
  }
  if (!AllVariables.length) {
    return query;
  }
  let filteredQuery = query;
  AllVariables.forEach((variable) => {
    while (filteredQuery.includes(variable)) {
      filteredQuery = filteredQuery.replace(variable, variable.split('__ZEUS_VAR__')[0]);
    }
  });
  return `(${AllVariables.map((a) => a.split('__ZEUS_VAR__'))
    .map(([variableName, variableType]) => `${variableName}:${variableType}`)
    .join(', ')})${filteredQuery}`;
};


export const queryConstruct = (t: 'query' | 'mutation' | 'subscription', tName: string, operationName?: string) => (o: Record<any, any>) =>
  `${t.toLowerCase()}${operationName ? ' ' + operationName : ''}${inspectVariables(buildQuery(tName, o))}`;
  

export const fullChainConstruct = (fn: FetchFunction) => (t: 'query' | 'mutation' | 'subscription', tName: string) => (
  o: Record<any, any>,
  options?: OperationOptions,
) => fn(queryConstruct(t, tName, options?.operationName)(o), options?.variables).then((r:any) => { 
  seekForAliases(r)
  return r
});


export const fullSubscriptionConstruct = (fn: SubscriptionFunction) => (
  t: 'query' | 'mutation' | 'subscription',
  tName: string,
) => (o: Record<any, any>, options?: OperationOptions) =>
  fn(queryConstruct(t, tName, options?.operationName)(o));


const seekForAliases = (response: any) => {
  const traverseAlias = (value: any) => {
    if (Array.isArray(value)) {
      value.forEach(seekForAliases);
    } else {
      if (typeof value === 'object') {
        seekForAliases(value);
      }
    }
  };
  if (typeof response === 'object' && response) {
    const keys = Object.keys(response);
    if (keys.length < 1) {
      return;
    }
    keys.forEach((k) => {
      const value = response[k];
      if (k.indexOf('__alias__') !== -1) {
        const [operation, alias] = k.split('__alias__');
        response[alias] = {
          [operation]: value,
        };
        delete response[k];
      }
      traverseAlias(value);
    });
  }
};


export const $ = (t: TemplateStringsArray): any => `ZEUS_VAR$${t.join('')}`;


export const resolverFor = <
  X,
  T extends keyof ValueTypes,
  Z extends keyof ValueTypes[T],
>(
  type: T,
  field: Z,
  fn: (
    args: Required<ValueTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : any,
) => fn as (args?: any,source?: any) => any;


const handleFetchResponse = (
  response: Parameters<Extract<Parameters<ReturnType<typeof fetch>['then']>[0], Function>>[0]
): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response.text().then(text => {
        try { reject(JSON.parse(text)); }
        catch (err) { reject(text); }
      }).catch(reject);
    });
  }
  return response.json();
};

export const apiFetch = (options: fetchOptions) => (query: string, variables: Record<string, any> = {}) => {
    let fetchFunction = fetch;
    let queryString = query;
    let fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      queryString = encodeURIComponent(query);
      return fetchFunction(`${options[0]}?query=${queryString}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetchFunction(`${options[0]}`, {
      body: JSON.stringify({ query: queryString, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };
  

export const apiSubscription = (options: chainOptions) => (
    query: string,
  ) => {
    try {
      const queryString = options[0] + '?query=' + encodeURIComponent(query);
      const wsString = queryString.replace('http', 'ws');
      const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
      const webSocketOptions = options[1]?.websocket || [host];
      const ws = new WebSocket(...webSocketOptions);
      return {
        ws,
        on: (e: (args: any) => void) => {
          ws.onmessage = (event:any) => {
            if(event.data){
              const parsed = JSON.parse(event.data)
              const data = parsed.data
              if (data) {
                seekForAliases(data);
              }
              return e(data);
            }
          };
        },
        off: (e: (args: any) => void) => {
          ws.onclose = e;
        },
        error: (e: (args: any) => void) => {
          ws.onerror = e;
        },
        open: (e: () => void) => {
          ws.onopen = e;
        },
      };
    } catch {
      throw new Error('No websockets implemented');
    }
  };



const allOperations = {
    "query": "Query",
    "mutation": "Mutation"
}

export type GenericOperation<O> = O extends 'query'
  ? "Query"
  : O extends 'mutation'
  ? "Mutation"
  : never

export const Thunder = (fn: FetchFunction) => <
  O extends 'query' | 'mutation',
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
) => <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions) =>
  fullChainConstruct(fn)(operation, allOperations[operation])(o as any, ops) as Promise<InputType<GraphQLTypes[R], Z>>;

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));  
  
export const SubscriptionThunder = (fn: SubscriptionFunction) => <
  O extends 'query' | 'mutation',
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
) => <Z extends ValueTypes[R]>(
  o: Z | ValueTypes[R],
  ops?: OperationOptions
)=>
  fullSubscriptionConstruct(fn)(operation, allOperations[operation])(
    o as any,
    ops,
  ) as SubscriptionToGraphQL<Z, GraphQLTypes[R]>;

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends 'query' | 'mutation',
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
  o: Z | ValueTypes[R],
  operationName?: string,
) => queryConstruct(operation, allOperations[operation], operationName)(o as any);
export const Selector = <T extends keyof ValueTypes>(key: T) => ZeusSelect<ValueTypes[T]>();
  

export const Gql = Chain('http://101.35.96.91:2333/graphql')