/* eslint-disable */

import { AllTypesProps, ReturnTypes, Ops } from './const';
export const HOST = "http://101.35.96.91:2333/graphql"



const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then((text) => {
          try {
            reject(JSON.parse(text));
          } catch (err) {
            reject(text);
          }
        })
        .catch(reject);
    });
  }
  return response.json();
};

export const apiFetch = (options: fetchOptions) => (query: string, variables: Record<string, unknown> = {}) => {
  const fetchOptions = options[1] || {};
  if (fetchOptions.method && fetchOptions.method === 'GET') {
    return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  }
  return fetch(`${options[0]}`, {
    body: JSON.stringify({ query, variables }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...fetchOptions,
  })
    .then(handleFetchResponse)
    .then((response: GraphQLResponse) => {
      if (response.errors) {
        throw new GraphQLError(response);
      }
      return response.data;
    });
};




export const apiSubscription = (options: chainOptions) => (query: string) => {
  try {
    const queryString = options[0] + '?query=' + encodeURIComponent(query);
    const wsString = queryString.replace('http', 'ws');
    const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
    const webSocketOptions = options[1]?.websocket || [host];
    const ws = new WebSocket(...webSocketOptions);
    return {
      ws,
      on: (e: (args: any) => void) => {
        ws.onmessage = (event: any) => {
          if (event.data) {
            const parsed = JSON.parse(event.data);
            const data = parsed.data;
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






export const InternalsBuildQuery = (
  props: AllTypesPropsType,
  returns: ReturnTypesType,
  ops: Operations,
  options?: OperationOptions,
) => {
  const ibb = (k: string, o: InputValueType | VType, p = '', root = true): string => {
    const keyForPath = purifyGraphQLKey(k);
    const newPath = [p, keyForPath].join(SEPARATOR);
    if (!o) {
      return '';
    }
    if (typeof o === 'boolean' || typeof o === 'number') {
      return k;
    }
    if (typeof o === 'string') {
      return `${k} ${o}`;
    }
    if (Array.isArray(o)) {
      const args = InternalArgsBuilt(props, returns, ops, options?.variables?.values)(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false)}`;
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(`${alias}:${operationName}`, operation, p, false);
        })
        .join('\n');
    }
    const hasOperationName = root && options?.operationName ? ' ' + options.operationName : '';
    const hasVariables = root && options?.variables?.$params ? `(${options.variables?.$params})` : '';
    const keyForDirectives = o.__directives ? `${k} ${o.__directives}` : k;
    return `${keyForDirectives}${hasOperationName}${hasVariables}{${Object.entries(o)
      .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false))
      .join('\n')}}`;
  };
  return ibb;
};










export const Thunder = (fn: FetchFunction) => <
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
) => <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions) =>
  fullChainConstruct(fn)(operation)(o as any, ops) as Promise<InputType<GraphQLTypes[R], Z>>;

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder = (fn: SubscriptionFunction) => <
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
) => <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions) =>
  fullSubscriptionConstruct(fn)(operation)(o as any, ops) as SubscriptionToGraphQL<Z, GraphQLTypes[R]>;

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
  o: Z | ValueTypes[R],
  ops?: OperationOptions,
) => InternalsBuildQuery(AllTypesProps, ReturnTypes, Ops, ops)(operation, o as any);
export const Selector = <T extends keyof ValueTypes>(key: T) => ZeusSelect<ValueTypes[T]>();

export const Gql = Chain(HOST);






export const fullChainConstruct = (fn: FetchFunction) => (t: 'query' | 'mutation' | 'subscription') => (
  o: Record<any, any>,
  options?: OperationOptions,
) => {
  const builder = InternalsBuildQuery(AllTypesProps, ReturnTypes, Ops, options);
  return fn(builder(t, o), options?.variables?.values);
};






export const fullSubscriptionConstruct = (fn: SubscriptionFunction) => (t: 'query' | 'mutation' | 'subscription') => (
  o: Record<any, any>,
  options?: OperationOptions,
) => {
  const builder = InternalsBuildQuery(AllTypesProps, ReturnTypes, Ops, options);
  return fn(builder(t, o));
};





export type AllTypesPropsType = {
  [x: string]:
    | undefined
    | boolean
    | {
        [x: string]:
          | undefined
          | string
          | {
              [x: string]: string | undefined;
            };
      };
};

export type ReturnTypesType = {
  [x: string]:
    | {
        [x: string]: string | undefined;
      }
    | undefined;
};
export type InputValueType = {
  [x: string]: undefined | boolean | string | number | [any, undefined | boolean | InputValueType] | InputValueType;
};
export type VType =
  | undefined
  | boolean
  | string
  | number
  | [any, undefined | boolean | InputValueType]
  | InputValueType;

export type PlainType = boolean | number | string | null | undefined;
export type ZeusArgsType =
  | PlainType
  | {
      [x: string]: ZeusArgsType;
    }
  | Array<ZeusArgsType>;

export type Operations = Record<string, string | undefined>;

export type VariableDefinition = {
  [x: string]: unknown;
};

export const SEPARATOR = '|';

export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (...args: infer R) => WebSocket ? R : never;
export type chainOptions = [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }] | [fetchOptions[0]];
export type FetchFunction = (query: string, variables?: Record<string, any>) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export type OperationOptions = {
  variables?: VariableInput;
  operationName?: string;
};
export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
export class GraphQLError extends Error {
  constructor(public response: GraphQLResponse) {
    super('');
    console.error(response);
  }
  toString() {
    return 'GraphQL Response Error';
  }
}
export type GenericOperation<O> = O extends keyof typeof Ops ? typeof Ops[O] : never;


export const purifyGraphQLKey = (k: string) => k.replace(/\([^)]*\)/g, '').replace(/^[^:]*\:/g, '');




const mapPart = (p: string) => {
  const [isArg, isField] = p.split('<>');
  if (isField) {
    return {
      v: isField,
      __type: 'field',
    } as const;
  }
  return {
    v: isArg,
    __type: 'arg',
  } as const;
};

type Part = ReturnType<typeof mapPart>;

export const ResolveFromPath = (props: AllTypesPropsType, returns: ReturnTypesType, ops: Operations) => {
  const ResolvePropsType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
    if (typeof propsP1 === 'boolean' && mappedParts.length === 1) {
      return 'enum';
    }
    if (typeof propsP1 === 'object') {
      const propsP2 = propsP1[mappedParts[1].v];
      if (typeof propsP2 === 'string') {
        return rpp(
          `${propsP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
      if (typeof propsP2 === 'object') {
        const propsP3 = propsP2[mappedParts[2].v];
        if (propsP3 && mappedParts[2].__type === 'arg') {
          return rpp(
            `${propsP3}${SEPARATOR}${mappedParts
              .slice(3)
              .map((mp) => mp.v)
              .join(SEPARATOR)}`,
          );
        }
      }
    }
  };
  const ResolveReturnType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === 'object') {
      const returnP2 = returnP1[mappedParts[1].v];
      if (returnP2) {
        return rpp(
          `${returnP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
    }
  };
  const rpp = (path: string): 'enum' | 'not' => {
    const parts = path.split(SEPARATOR).filter((l) => l.length > 0);
    const mappedParts = parts.map(mapPart);
    const propsP1 = ResolvePropsType(mappedParts);
    if (propsP1) {
      return propsP1;
    }
    const returnP1 = ResolveReturnType(mappedParts);
    if (returnP1) {
      return returnP1;
    }
    return 'not';
  };
  return rpp;
};

export const InternalArgsBuilt = (
  props: AllTypesPropsType,
  returns: ReturnTypesType,
  ops: Operations,
  variables?: Record<string, unknown>,
) => {
  const arb = (a: ZeusArgsType, p = '', root = true): string => {
    if (Array.isArray(a)) {
      return `[${a.map((arr) => arb(arr, p, false)).join(', ')}]`;
    }
    if (typeof a === 'string') {
      if (a.startsWith('$') && variables?.[a.slice(1)]) {
        return a;
      }
      const checkType = ResolveFromPath(props, returns, ops)(p);
      if (checkType === 'enum') {
        return a;
      }
      return `${JSON.stringify(a)}`;
    }
    if (typeof a === 'object') {
      if (a === null) {
        return `null`;
      }
      const returnedObjectString = Object.entries(a)
        .filter(([, v]) => typeof v !== 'undefined')
        .map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`)
        .join(',\n');
      if (!root) {
        return `{${returnedObjectString}}`;
      }
      return returnedObjectString;
    }
    return `${a}`;
  };
  return arb;
};




export const resolverFor = <X, T extends keyof ValueTypes, Z extends keyof ValueTypes[T]>(
  type: T,
  field: Z,
  fn: (
    args: Required<ValueTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : any,
) => fn as (args?: any, source?: any) => any;


export type SelectionFunction<V> = <T>(t: T | V) => T;
export const ZeusSelect = <T>() => ((t: unknown) => t) as SelectionFunction<T>;




export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<UnwrapPromise<ReturnType<T>>>;
export type ZeusHook<
  T extends (...args: any[]) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>
> = ZeusState<ReturnType<T>[N]>;

export type WithTypeNameValue<T> = T & {
  __typename?: boolean;
  __directives?: string;
};
export type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
type IsArray<T, U> = T extends Array<infer R> ? InputType<R, U>[] : InputType<T, U>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string;

type IsInterfaced<SRC extends DeepAnify<DST>, DST> = FlattenArray<SRC> extends ZEUS_INTERFACES | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P]>
          : Record<string, unknown>
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
        >]: IsPayLoad<DST[P]> extends BaseZeusResolver ? SRC[P] : IsArray<SRC[P], DST[P]>;
      }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends BaseZeusResolver ? SRC[P] : IsArray<SRC[P], DST[P]>;
    };

export type MapType<SRC, DST> = SRC extends DeepAnify<DST> ? IsInterfaced<SRC, DST> : never;
export type InputType<SRC, DST> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P]>[keyof MapType<SRC, R[P]>];
    } &
      MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>>
  : MapType<SRC, IsPayLoad<DST>>;
export type SubscriptionToGraphQL<Z, T> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z>; errors?: string[] }) => void) => void;
  open: () => void;
};


export const useZeusVariables = <T>(variables: T) => <
  Z extends {
    [P in keyof T]: unknown;
  }
>(
  values: Z,
) => {
  return {
    $params: Object.keys(variables)
      .map((k) => `$${k}: ${variables[k as keyof T]}`)
      .join(', '),
    $: <U extends keyof Z>(variable: U) => {
      return (`$${variable}` as unknown) as Z[U];
    },
    values,
  };
};

export type VariableInput = {
  $params: ReturnType<ReturnType<typeof useZeusVariables>>['$params'];
  values: Record<string, unknown>;
};


type ZEUS_INTERFACES = GraphQLTypes["BaseResult"]
type ZEUS_UNIONS = never

export type ValueTypes = {
    ["Query"]: AliasType<{
hello?: [{	name: string},boolean | `@${string}`],
	/** 获取我的信息 */
	me?:ValueTypes["LoginUser"],
	/** 菜单Tree查询 */
	getMenuTree?:ValueTypes["Menu"],
getMenuList?: [{	/** 角色id */
	id?: string | undefined | null,	/** 角色名 */
	name?: string | undefined | null,	/** 是否可见 */
	visible?: boolean | undefined | null,	/** 开始时间YYYY-DD-MM */
	from?: string | undefined | null,	/** 结束时间YYYY-DD-MM */
	to?: string | undefined | null,	pageNo?: number | undefined | null,	pageSize?: number | undefined | null},ValueTypes["MenuPageResult"]],
getRoleList?: [{	/** 角色id */
	id?: string | undefined | null,	/** 角色名 */
	name?: string | undefined | null,	/** 角色标识 */
	key?: string | undefined | null,	/** 是否默认标识 */
	isDefault?: boolean | undefined | null,	/** 开始时间YYYY-DD-MM */
	from?: string | undefined | null,	/** 结束时间YYYY-DD-MM */
	to?: string | undefined | null,	/** 是否默认标识 */
	includeMenu?: boolean | undefined | null,	pageNo?: number | undefined | null,	pageSize?: number | undefined | null},ValueTypes["RolePageResult"]],
getUserList?: [{	/** 用户id */
	id?: string | undefined | null,	/** 用户名 */
	username?: string | undefined | null,	/** 用户手机 */
	phone?: string | undefined | null,	/** 邮箱 */
	email?: string | undefined | null,	/** 开始时间YYYY-DD-MM */
	from?: string | undefined | null,	/** 结束时间YYYY-DD-MM */
	to?: string | undefined | null,	/** 是否包含角色 */
	includeRole?: boolean | undefined | null,	pageNo?: number | undefined | null,	pageSize?: number | undefined | null},ValueTypes["UserPageResult"]],
		__typename?: boolean | `@${string}`
}>;
	["LoginUser"]: AliasType<{
	id?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 用户名 */
	username?:boolean | `@${string}`,
	/** 头像 */
	avatar?:boolean | `@${string}`,
	/** 性别 */
	gender?:boolean | `@${string}`,
	/** 邮箱 */
	email?:boolean | `@${string}`,
	/** 昵称 */
	nickname?:boolean | `@${string}`,
	/** 手机 */
	phone?:boolean | `@${string}`,
	/** 备注 */
	note?:boolean | `@${string}`,
	/** 角色 */
	roles?:ValueTypes["Role"],
	/** 登录时间 */
	loginTime?:boolean | `@${string}`,
	/** 菜单 */
	menus?:ValueTypes["Menu"],
	/** 权限 */
	permissions?:boolean | `@${string}`,
	/** 管理员 */
	isSuperAdmin?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
["DateTime"]:unknown;
	/** 用户性别枚举 */
["UserGenderEnum"]:UserGenderEnum;
	["Role"]: AliasType<{
	id?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 角色名 */
	name?:boolean | `@${string}`,
	/** 角色level */
	level?:boolean | `@${string}`,
	/** 标识 */
	key?:boolean | `@${string}`,
	/** 是否默认 */
	isDefault?:boolean | `@${string}`,
	/** 权限菜单 */
	menus?:ValueTypes["Menu"],
		__typename?: boolean | `@${string}`
}>;
	["Menu"]: AliasType<{
	id?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 菜单名 */
	name?:boolean | `@${string}`,
	/** 图标 */
	icon?:boolean | `@${string}`,
	/** 上级ID */
	pId?:boolean | `@${string}`,
	/** 排序 */
	orderBy?:boolean | `@${string}`,
	/** 路径 */
	path?:boolean | `@${string}`,
	/** 组件 */
	component?:boolean | `@${string}`,
	/** 可见 */
	visible?:boolean | `@${string}`,
	/** 权限字符 */
	permission?:boolean | `@${string}`,
	/** 类型 */
	type?:boolean | `@${string}`,
	/** children */
	children?:ValueTypes["Menu"],
		__typename?: boolean | `@${string}`
}>;
	["MenuPageResult"]: AliasType<{
	data?:ValueTypes["Menu"],
	totalCount?:boolean | `@${string}`,
	hasNextPage?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["RolePageResult"]: AliasType<{
	data?:ValueTypes["Role"],
	totalCount?:boolean | `@${string}`,
	hasNextPage?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserPageResult"]: AliasType<{
	data?:ValueTypes["User"],
	totalCount?:boolean | `@${string}`,
	hasNextPage?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["User"]: AliasType<{
	id?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 用户名 */
	username?:boolean | `@${string}`,
	/** 头像 */
	avatar?:boolean | `@${string}`,
	/** 性别 */
	gender?:boolean | `@${string}`,
	/** 邮箱 */
	email?:boolean | `@${string}`,
	/** 昵称 */
	nickname?:boolean | `@${string}`,
	/** 手机 */
	phone?:boolean | `@${string}`,
	/** 备注 */
	note?:boolean | `@${string}`,
	/** 角色 */
	roles?:ValueTypes["Role"],
		__typename?: boolean | `@${string}`
}>;
	["Mutation"]: AliasType<{
login?: [{	password: string,	username: string},ValueTypes["LoginResult"]],
	logout?:ValueTypes["BaseResponse"],
createMenu?: [{	input: ValueTypes["CreateMenuInput"]},ValueTypes["BaseResponse"]],
editMenu?: [{	input: ValueTypes["EditMenuInput"]},ValueTypes["BaseResponse"]],
removeMenus?: [{	menuIds: Array<string>},ValueTypes["BaseResponse"]],
createRole?: [{	input: ValueTypes["CreateRoleInput"]},ValueTypes["BaseResponse"]],
editRole?: [{	input: ValueTypes["EditRoleInput"]},ValueTypes["BaseResponse"]],
removeRoles?: [{	roleIds: Array<string>},ValueTypes["BaseResponse"]],
createUser?: [{	input: ValueTypes["CreateUserInput"]},ValueTypes["BaseResponse"]],
editUser?: [{	input: ValueTypes["EditUserInput"]},ValueTypes["BaseResponse"]],
removeUsers?: [{	userIds: Array<string>},ValueTypes["BaseResponse"]],
		__typename?: boolean | `@${string}`
}>;
	["LoginResult"]: AliasType<{
	/** code */
	code?:boolean | `@${string}`,
	/** msg */
	msg?:boolean | `@${string}`,
	/** data */
	data?:ValueTypes["LoginType"],
		__typename?: boolean | `@${string}`
}>;
	["LoginType"]: AliasType<{
	/** accessToken */
	accessToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["BaseResponse"]: AliasType<{
	code?:boolean | `@${string}`,
	msg?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["BaseResult"]:AliasType<{
		code?:boolean | `@${string}`,
	msg?:boolean | `@${string}`;
		['...on BaseResponse']?: Omit<ValueTypes["BaseResponse"],keyof ValueTypes["BaseResult"]>;
		__typename?: boolean | `@${string}`
}>;
	["CreateMenuInput"]: {
	/** 菜单名 */
	name: string,
	/** 图标 */
	icon?: string | undefined | null,
	/** 上级ID */
	pId?: string | undefined | null,
	/** 排序 */
	orderBy?: number | undefined | null,
	/** 路径 */
	path?: string | undefined | null,
	/** 组件 */
	component?: string | undefined | null,
	/** 可见 */
	visible?: boolean | undefined | null,
	/** 权限字符 */
	permission?: string | undefined | null,
	/** 类型 */
	type?: string | undefined | null
};
	["EditMenuInput"]: {
	/** id */
	id: string,
	/** 菜单名 */
	name?: string | undefined | null,
	/** 图标 */
	icon?: string | undefined | null,
	/** 上级ID */
	pId?: string | undefined | null,
	/** 排序 */
	orderBy?: number | undefined | null,
	/** 路径 */
	path?: string | undefined | null,
	/** 组件 */
	component?: string | undefined | null,
	/** 可见 */
	visible?: boolean | undefined | null,
	/** 权限字符 */
	permission?: string | undefined | null,
	/** 类型 */
	type?: string | undefined | null
};
	["CreateRoleInput"]: {
	/** 角色名 */
	name: string,
	/** 角色标识 */
	key: string,
	/** 权限等级 */
	level: number,
	/** 菜单ID */
	menuIds?: Array<string> | undefined | null
};
	["EditRoleInput"]: {
	/** 角色id */
	id: string,
	/** 角色名 */
	name?: string | undefined | null,
	/** 角色标识 */
	key?: string | undefined | null,
	/** 权限等级 */
	level?: number | undefined | null,
	/** 菜单ID */
	menuIds?: Array<string> | undefined | null
};
	["CreateUserInput"]: {
	/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string | undefined | null,
	/** 密码 */
	password: string,
	/** 性别 */
	gender?: ValueTypes["UserGenderEnum"] | undefined | null,
	/** 邮箱 */
	email?: string | undefined | null,
	/** 昵称 */
	nickname?: string | undefined | null,
	/** 手机 */
	phone?: string | undefined | null,
	/** 备注 */
	note?: string | undefined | null,
	/** 角色 */
	roleIds?: Array<string> | undefined | null
};
	["EditUserInput"]: {
	/** 角色id */
	id: string,
	/** 头像 */
	avatar?: string | undefined | null,
	/** 性别 */
	gender?: ValueTypes["UserGenderEnum"] | undefined | null,
	/** 邮箱 */
	email?: string | undefined | null,
	/** 昵称 */
	nickname?: string | undefined | null,
	/** 手机 */
	phone?: string | undefined | null,
	/** 备注 */
	note?: string | undefined | null,
	/** 角色 */
	roleIds?: Array<string> | undefined | null
}
  }

export type ModelTypes = {
    ["Query"]: {
		hello: string,
	/** 获取我的信息 */
	me: GraphQLTypes["LoginUser"],
	/** 菜单Tree查询 */
	getMenuTree: Array<GraphQLTypes["Menu"]>,
	/** 菜单列表查询 */
	getMenuList: GraphQLTypes["MenuPageResult"],
	/** 角色列表查询 */
	getRoleList: GraphQLTypes["RolePageResult"],
	/** 角色列表查询 */
	getUserList: GraphQLTypes["UserPageResult"]
};
	["LoginUser"]: {
		id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"] | undefined,
	/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string | undefined,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"] | undefined,
	/** 邮箱 */
	email?: string | undefined,
	/** 昵称 */
	nickname?: string | undefined,
	/** 手机 */
	phone?: string | undefined,
	/** 备注 */
	note?: string | undefined,
	/** 角色 */
	roles?: Array<GraphQLTypes["Role"] | undefined> | undefined,
	/** 登录时间 */
	loginTime?: GraphQLTypes["DateTime"] | undefined,
	/** 菜单 */
	menus?: Array<GraphQLTypes["Menu"] | undefined> | undefined,
	/** 权限 */
	permissions?: Array<string | undefined> | undefined,
	/** 管理员 */
	isSuperAdmin?: boolean | undefined
};
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
["DateTime"]:any;
	/** 用户性别枚举 */
["UserGenderEnum"]: GraphQLTypes["UserGenderEnum"];
	["Role"]: {
		id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"] | undefined,
	/** 角色名 */
	name: string,
	/** 角色level */
	level: number,
	/** 标识 */
	key?: string | undefined,
	/** 是否默认 */
	isDefault?: boolean | undefined,
	/** 权限菜单 */
	menus?: Array<GraphQLTypes["Menu"] | undefined> | undefined
};
	["Menu"]: {
		id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"] | undefined,
	/** 菜单名 */
	name: string,
	/** 图标 */
	icon?: string | undefined,
	/** 上级ID */
	pId?: string | undefined,
	/** 排序 */
	orderBy?: number | undefined,
	/** 路径 */
	path?: string | undefined,
	/** 组件 */
	component?: string | undefined,
	/** 可见 */
	visible?: boolean | undefined,
	/** 权限字符 */
	permission?: string | undefined,
	/** 类型 */
	type?: string | undefined,
	/** children */
	children?: Array<GraphQLTypes["Menu"] | undefined> | undefined
};
	["MenuPageResult"]: {
		data?: Array<GraphQLTypes["Menu"]> | undefined,
	totalCount: number,
	hasNextPage: boolean
};
	["RolePageResult"]: {
		data?: Array<GraphQLTypes["Role"]> | undefined,
	totalCount: number,
	hasNextPage: boolean
};
	["UserPageResult"]: {
		data?: Array<GraphQLTypes["User"]> | undefined,
	totalCount: number,
	hasNextPage: boolean
};
	["User"]: {
		id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"] | undefined,
	/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string | undefined,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"] | undefined,
	/** 邮箱 */
	email?: string | undefined,
	/** 昵称 */
	nickname?: string | undefined,
	/** 手机 */
	phone?: string | undefined,
	/** 备注 */
	note?: string | undefined,
	/** 角色 */
	roles?: Array<GraphQLTypes["Role"] | undefined> | undefined
};
	["Mutation"]: {
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
	removeUsers: GraphQLTypes["BaseResponse"]
};
	["LoginResult"]: {
		/** code */
	code?: number | undefined,
	/** msg */
	msg?: string | undefined,
	/** data */
	data?: GraphQLTypes["LoginType"] | undefined
};
	["LoginType"]: {
		/** accessToken */
	accessToken: string
};
	["BaseResponse"]: {
		code: number,
	msg: string
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
	getMenuTree: Array<GraphQLTypes["Menu"]>,
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
	createdAt?: GraphQLTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"] | undefined,
	/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string | undefined,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"] | undefined,
	/** 邮箱 */
	email?: string | undefined,
	/** 昵称 */
	nickname?: string | undefined,
	/** 手机 */
	phone?: string | undefined,
	/** 备注 */
	note?: string | undefined,
	/** 角色 */
	roles?: Array<GraphQLTypes["Role"] | undefined> | undefined,
	/** 登录时间 */
	loginTime?: GraphQLTypes["DateTime"] | undefined,
	/** 菜单 */
	menus?: Array<GraphQLTypes["Menu"] | undefined> | undefined,
	/** 权限 */
	permissions?: Array<string | undefined> | undefined,
	/** 管理员 */
	isSuperAdmin?: boolean | undefined
};
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
["DateTime"]: any;
	/** 用户性别枚举 */
["UserGenderEnum"]: UserGenderEnum;
	["Role"]: {
	__typename: "Role",
	id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"] | undefined,
	/** 角色名 */
	name: string,
	/** 角色level */
	level: number,
	/** 标识 */
	key?: string | undefined,
	/** 是否默认 */
	isDefault?: boolean | undefined,
	/** 权限菜单 */
	menus?: Array<GraphQLTypes["Menu"] | undefined> | undefined
};
	["Menu"]: {
	__typename: "Menu",
	id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"] | undefined,
	/** 菜单名 */
	name: string,
	/** 图标 */
	icon?: string | undefined,
	/** 上级ID */
	pId?: string | undefined,
	/** 排序 */
	orderBy?: number | undefined,
	/** 路径 */
	path?: string | undefined,
	/** 组件 */
	component?: string | undefined,
	/** 可见 */
	visible?: boolean | undefined,
	/** 权限字符 */
	permission?: string | undefined,
	/** 类型 */
	type?: string | undefined,
	/** children */
	children?: Array<GraphQLTypes["Menu"] | undefined> | undefined
};
	["MenuPageResult"]: {
	__typename: "MenuPageResult",
	data?: Array<GraphQLTypes["Menu"]> | undefined,
	totalCount: number,
	hasNextPage: boolean
};
	["RolePageResult"]: {
	__typename: "RolePageResult",
	data?: Array<GraphQLTypes["Role"]> | undefined,
	totalCount: number,
	hasNextPage: boolean
};
	["UserPageResult"]: {
	__typename: "UserPageResult",
	data?: Array<GraphQLTypes["User"]> | undefined,
	totalCount: number,
	hasNextPage: boolean
};
	["User"]: {
	__typename: "User",
	id: string,
	/** 创建时间 */
	createdAt?: GraphQLTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["DateTime"] | undefined,
	/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string | undefined,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"] | undefined,
	/** 邮箱 */
	email?: string | undefined,
	/** 昵称 */
	nickname?: string | undefined,
	/** 手机 */
	phone?: string | undefined,
	/** 备注 */
	note?: string | undefined,
	/** 角色 */
	roles?: Array<GraphQLTypes["Role"] | undefined> | undefined
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
	removeUsers: GraphQLTypes["BaseResponse"]
};
	["LoginResult"]: {
	__typename: "LoginResult",
	/** code */
	code?: number | undefined,
	/** msg */
	msg?: string | undefined,
	/** data */
	data?: GraphQLTypes["LoginType"] | undefined
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
	icon?: string | undefined,
	/** 上级ID */
	pId?: string | undefined,
	/** 排序 */
	orderBy?: number | undefined,
	/** 路径 */
	path?: string | undefined,
	/** 组件 */
	component?: string | undefined,
	/** 可见 */
	visible?: boolean | undefined,
	/** 权限字符 */
	permission?: string | undefined,
	/** 类型 */
	type?: string | undefined
};
	["EditMenuInput"]: {
		/** id */
	id: string,
	/** 菜单名 */
	name?: string | undefined,
	/** 图标 */
	icon?: string | undefined,
	/** 上级ID */
	pId?: string | undefined,
	/** 排序 */
	orderBy?: number | undefined,
	/** 路径 */
	path?: string | undefined,
	/** 组件 */
	component?: string | undefined,
	/** 可见 */
	visible?: boolean | undefined,
	/** 权限字符 */
	permission?: string | undefined,
	/** 类型 */
	type?: string | undefined
};
	["CreateRoleInput"]: {
		/** 角色名 */
	name: string,
	/** 角色标识 */
	key: string,
	/** 权限等级 */
	level: number,
	/** 菜单ID */
	menuIds?: Array<string> | undefined
};
	["EditRoleInput"]: {
		/** 角色id */
	id: string,
	/** 角色名 */
	name?: string | undefined,
	/** 角色标识 */
	key?: string | undefined,
	/** 权限等级 */
	level?: number | undefined,
	/** 菜单ID */
	menuIds?: Array<string> | undefined
};
	["CreateUserInput"]: {
		/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string | undefined,
	/** 密码 */
	password: string,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"] | undefined,
	/** 邮箱 */
	email?: string | undefined,
	/** 昵称 */
	nickname?: string | undefined,
	/** 手机 */
	phone?: string | undefined,
	/** 备注 */
	note?: string | undefined,
	/** 角色 */
	roleIds?: Array<string> | undefined
};
	["EditUserInput"]: {
		/** 角色id */
	id: string,
	/** 头像 */
	avatar?: string | undefined,
	/** 性别 */
	gender?: GraphQLTypes["UserGenderEnum"] | undefined,
	/** 邮箱 */
	email?: string | undefined,
	/** 昵称 */
	nickname?: string | undefined,
	/** 手机 */
	phone?: string | undefined,
	/** 备注 */
	note?: string | undefined,
	/** 角色 */
	roleIds?: Array<string> | undefined
}
    }
/** 用户性别枚举 */
export const enum UserGenderEnum {
	UNKNOWN = "UNKNOWN",
	MALE = "MALE",
	FEMALE = "FEMALE"
}