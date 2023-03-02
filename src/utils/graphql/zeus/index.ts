/* eslint-disable */

import { AllTypesProps, ReturnTypes, Ops } from './const';
export const HOST = "http://123.60.183.170:4000/graphql"


export const HEADERS = {}
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
  return response.json() as Promise<GraphQLResponse>;
};

export const apiFetch =
  (options: fetchOptions) =>
  (query: string, variables: Record<string, unknown> = {}) => {
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

export const InternalsBuildQuery = ({
  ops,
  props,
  returns,
  options,
  scalars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  options?: OperationOptions;
  scalars?: ScalarDefinition;
}) => {
  const ibb = (
    k: string,
    o: InputValueType | VType,
    p = '',
    root = true,
    vars: Array<{ name: string; graphQLType: string }> = [],
  ): string => {
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
      const args = InternalArgsBuilt({
        props,
        returns,
        ops,
        scalars,
        vars,
      })(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
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
          return ibb(`${alias}:${operationName}`, operation, p, false, vars);
        })
        .join('\n');
    }
    const hasOperationName = root && options?.operationName ? ' ' + options.operationName : '';
    const keyForDirectives = o.__directives ?? '';
    const query = `{${Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false, vars))
      .join('\n')}}`;
    if (!root) {
      return `${k} ${keyForDirectives}${hasOperationName} ${query}`;
    }
    const varsString = vars.map((v) => `${v.name}: ${v.graphQLType}`).join(', ');
    return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ''} ${query}`;
  };
  return ibb;
};

export const Thunder =
  (fn: FetchFunction) =>
  <O extends keyof typeof Ops, SCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<SCLR>,
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions & { variables?: Record<string, unknown> }) =>
    fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: graphqlOptions?.scalars,
      }),
      ops?.variables,
    ).then((data) => {
      if (graphqlOptions?.scalars) {
        return decodeScalarsInResponse({
          response: data,
          initialOp: operation,
          initialZeusQuery: o as VType,
          returns: ReturnTypes,
          scalars: graphqlOptions.scalars,
          ops: Ops,
        });
      }
      return data;
    }) as Promise<InputType<GraphQLTypes[R], Z, SCLR>>;

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder =
  (fn: SubscriptionFunction) =>
  <O extends keyof typeof Ops, SCLR extends ScalarDefinition, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<SCLR>,
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions & { variables?: ExtractVariables<Z> }) => {
    const returnedFunction = fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: graphqlOptions?.scalars,
      }),
    ) as SubscriptionToGraphQL<Z, GraphQLTypes[R], SCLR>;
    if (returnedFunction?.on && graphqlOptions?.scalars) {
      const wrapped = returnedFunction.on;
      returnedFunction.on = (fnToCall: (args: InputType<GraphQLTypes[R], Z, SCLR>) => void) =>
        wrapped((data: InputType<GraphQLTypes[R], Z, SCLR>) => {
          if (graphqlOptions?.scalars) {
            return fnToCall(
              decodeScalarsInResponse({
                response: data,
                initialOp: operation,
                initialZeusQuery: o as VType,
                returns: ReturnTypes,
                scalars: graphqlOptions.scalars,
                ops: Ops,
              }),
            );
          }
          return fnToCall(data);
        });
    }
    return returnedFunction;
  };

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>,
>(
  operation: O,
  o: Z | ValueTypes[R],
  ops?: {
    operationOptions?: OperationOptions;
    scalars?: ScalarDefinition;
  },
) =>
  InternalsBuildQuery({
    props: AllTypesProps,
    returns: ReturnTypes,
    ops: Ops,
    options: ops?.operationOptions,
    scalars: ops?.scalars,
  })(operation, o as VType);

export const ZeusSelect = <T>() => ((t: unknown) => t) as SelectionFunction<T>;

export const Selector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();

export const TypeFromSelector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();
export const Gql = Chain(HOST, {
  headers: {
    'Content-Type': 'application/json',
    ...HEADERS,
  },
});

export const ZeusScalars = ZeusSelect<ScalarCoders>();

export const decodeScalarsInResponse = <O extends Operations>({
  response,
  scalars,
  returns,
  ops,
  initialZeusQuery,
  initialOp,
}: {
  ops: O;
  response: any;
  returns: ReturnTypesType;
  scalars?: Record<string, ScalarResolver | undefined>;
  initialOp: keyof O;
  initialZeusQuery: InputValueType | VType;
}) => {
  if (!scalars) {
    return response;
  }
  const builder = PrepareScalarPaths({
    ops,
    returns,
  });

  const scalarPaths = builder(initialOp as string, ops[initialOp], initialZeusQuery);
  if (scalarPaths) {
    const r = traverseResponse({ scalarPaths, resolvers: scalars })(initialOp as string, response, [ops[initialOp]]);
    return r;
  }
  return response;
};

export const traverseResponse = ({
  resolvers,
  scalarPaths,
}: {
  scalarPaths: { [x: string]: `scalar.${string}` };
  resolvers: {
    [x: string]: ScalarResolver | undefined;
  };
}) => {
  const ibb = (k: string, o: InputValueType | VType, p: string[] = []): unknown => {
    if (Array.isArray(o)) {
      return o.map((eachO) => ibb(k, eachO, p));
    }
    if (o == null) {
      return o;
    }
    const scalarPathString = p.join(SEPARATOR);
    const currentScalarString = scalarPaths[scalarPathString];
    if (currentScalarString) {
      const currentDecoder = resolvers[currentScalarString.split('.')[1]]?.decode;
      if (currentDecoder) {
        return currentDecoder(o);
      }
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string' || !o) {
      return o;
    }
    const entries = Object.entries(o).map(([k, v]) => [k, ibb(k, v, [...p, purifyGraphQLKey(k)])] as const);
    const objectFromEntries = entries.reduce<Record<string, unknown>>((a, [k, v]) => {
      a[k] = v;
      return a;
    }, {});
    return objectFromEntries;
  };
  return ibb;
};

export type AllTypesPropsType = {
  [x: string]:
    | undefined
    | `scalar.${string}`
    | 'enum'
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
    | `scalar.${string}`
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

export type Operations = Record<string, string>;

export type VariableDefinition = {
  [x: string]: unknown;
};

export const SEPARATOR = '|';

export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (...args: infer R) => WebSocket ? R : never;
export type chainOptions = [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }] | [fetchOptions[0]];
export type FetchFunction = (query: string, variables?: Record<string, unknown>) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export type OperationOptions = {
  operationName?: string;
};

export type ScalarCoder = Record<string, (s: unknown) => string>;

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
export type ThunderGraphQLOptions<SCLR extends ScalarDefinition> = {
  scalars?: SCLR | ScalarCoders;
};

const ExtractScalar = (mappedParts: string[], returns: ReturnTypesType): `scalar.${string}` | undefined => {
  if (mappedParts.length === 0) {
    return;
  }
  const oKey = mappedParts[0];
  const returnP1 = returns[oKey];
  if (typeof returnP1 === 'object') {
    const returnP2 = returnP1[mappedParts[1]];
    if (returnP2) {
      return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
    }
    return undefined;
  }
  return returnP1 as `scalar.${string}` | undefined;
};

export const PrepareScalarPaths = ({ ops, returns }: { returns: ReturnTypesType; ops: Operations }) => {
  const ibb = (
    k: string,
    originalKey: string,
    o: InputValueType | VType,
    p: string[] = [],
    pOriginals: string[] = [],
    root = true,
  ): { [x: string]: `scalar.${string}` } | undefined => {
    if (!o) {
      return;
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string') {
      const extractionArray = [...pOriginals, originalKey];
      const isScalar = ExtractScalar(extractionArray, returns);
      if (isScalar?.startsWith('scalar')) {
        const partOfTree = {
          [[...p, k].join(SEPARATOR)]: isScalar,
        };
        return partOfTree;
      }
      return {};
    }
    if (Array.isArray(o)) {
      return ibb(k, k, o[1], p, pOriginals, false);
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
          return ibb(alias, operationName, operation, p, pOriginals, false);
        })
        .reduce((a, b) => ({
          ...a,
          ...b,
        }));
    }
    const keyName = root ? ops[k] : k;
    return Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map(([k, v]) => {
        // Inline fragments shouldn't be added to the path as they aren't a field
        const isInlineFragment = originalKey.match(/^...\s*on/) != null;
        return ibb(
          k,
          k,
          v,
          isInlineFragment ? p : [...p, purifyGraphQLKey(keyName || k)],
          isInlineFragment ? pOriginals : [...pOriginals, purifyGraphQLKey(originalKey)],
          false,
        );
      })
      .reduce((a, b) => ({
        ...a,
        ...b,
      }));
  };
  return ibb;
};

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
    if (propsP1 === 'enum' && mappedParts.length === 1) {
      return 'enum';
    }
    if (typeof propsP1 === 'string' && propsP1.startsWith('scalar.') && mappedParts.length === 1) {
      return propsP1;
    }
    if (typeof propsP1 === 'object') {
      if (mappedParts.length < 2) {
        return 'not';
      }
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
        if (mappedParts.length < 3) {
          return 'not';
        }
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
    if (mappedParts.length === 0) {
      return 'not';
    }
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === 'object') {
      if (mappedParts.length < 2) return 'not';
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
  const rpp = (path: string): 'enum' | 'not' | `scalar.${string}` => {
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

export const InternalArgsBuilt = ({
  props,
  ops,
  returns,
  scalars,
  vars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  scalars?: ScalarDefinition;
  vars: Array<{ name: string; graphQLType: string }>;
}) => {
  const arb = (a: ZeusArgsType, p = '', root = true): string => {
    if (typeof a === 'string') {
      if (a.startsWith(START_VAR_NAME)) {
        const [varName, graphQLType] = a.replace(START_VAR_NAME, '$').split(GRAPHQL_TYPE_SEPARATOR);
        const v = vars.find((v) => v.name === varName);
        if (!v) {
          vars.push({
            name: varName,
            graphQLType,
          });
        } else {
          if (v.graphQLType !== graphQLType) {
            throw new Error(
              `Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`,
            );
          }
        }
        return varName;
      }
    }
    const checkType = ResolveFromPath(props, returns, ops)(p);
    if (checkType.startsWith('scalar.')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...splittedScalar] = checkType.split('.');
      const scalarKey = splittedScalar.join('.');
      return (scalars?.[scalarKey]?.encode?.(a) as string) || JSON.stringify(a);
    }
    if (Array.isArray(a)) {
      return `[${a.map((arr) => arb(arr, p, false)).join(', ')}]`;
    }
    if (typeof a === 'string') {
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

export const resolverFor = <X, T extends keyof ResolverInputTypes, Z extends keyof ResolverInputTypes[T]>(
  type: T,
  field: Z,
  fn: (
    args: Required<ResolverInputTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : never,
) => fn as (args?: any, source?: any) => ReturnType<typeof fn>;

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<UnwrapPromise<ReturnType<T>>>;
export type ZeusHook<
  T extends (...args: any[]) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>,
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
export type ScalarDefinition = Record<string, ScalarResolver>;

type IsScalar<S, SCLR extends ScalarDefinition> = S extends 'scalar' & { name: infer T }
  ? T extends keyof SCLR
    ? SCLR[T]['decode'] extends (s: unknown) => unknown
      ? ReturnType<SCLR[T]['decode']>
      : unknown
    : unknown
  : S;
type IsArray<T, U, SCLR extends ScalarDefinition> = T extends Array<infer R>
  ? InputType<R, U, SCLR>[]
  : InputType<T, U, SCLR>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string | Variable<any, string>;

type IsInterfaced<SRC extends DeepAnify<DST>, DST, SCLR extends ScalarDefinition> = FlattenArray<SRC> extends
  | ZEUS_INTERFACES
  | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P], SCLR>
          : IsArray<R, '__typename' extends keyof DST ? { __typename: true } : never, SCLR>
        : never;
    }[keyof SRC] & {
      [P in keyof Omit<
        Pick<
          SRC,
          {
            [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
          }[keyof DST]
        >,
        '__typename'
      >]: IsPayLoad<DST[P]> extends BaseZeusResolver ? IsScalar<SRC[P], SCLR> : IsArray<SRC[P], DST[P], SCLR>;
    }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends BaseZeusResolver
        ? IsScalar<SRC[P], SCLR>
        : IsArray<SRC[P], DST[P], SCLR>;
    };

export type MapType<SRC, DST, SCLR extends ScalarDefinition> = SRC extends DeepAnify<DST>
  ? IsInterfaced<SRC, DST, SCLR>
  : never;
// eslint-disable-next-line @typescript-eslint/ban-types
export type InputType<SRC, DST, SCLR extends ScalarDefinition = {}> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P], SCLR>[keyof MapType<SRC, R[P], SCLR>];
    } & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>, SCLR>
  : MapType<SRC, IsPayLoad<DST>, SCLR>;
export type SubscriptionToGraphQL<Z, T, SCLR extends ScalarDefinition> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z, SCLR>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z, SCLR>; errors?: string[] }) => void) => void;
  open: () => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type FromSelector<SELECTOR, NAME extends keyof GraphQLTypes, SCLR extends ScalarDefinition = {}> = InputType<
  GraphQLTypes[NAME],
  SELECTOR,
  SCLR
>;

export type ScalarResolver = {
  encode?: (s: unknown) => string;
  decode?: (s: unknown) => unknown;
};

export type SelectionFunction<V> = <T>(t: T | V) => T;

type BuiltInVariableTypes = {
  ['String']: string;
  ['Int']: number;
  ['Float']: number;
  ['ID']: unknown;
  ['Boolean']: boolean;
};
type AllVariableTypes = keyof BuiltInVariableTypes | keyof ZEUS_VARIABLES;
type VariableRequired<T extends string> = `${T}!` | T | `[${T}]` | `[${T}]!` | `[${T}!]` | `[${T}!]!`;
type VR<T extends string> = VariableRequired<VariableRequired<T>>;

export type GraphQLVariableType = VR<AllVariableTypes>;

type ExtractVariableTypeString<T extends string> = T extends VR<infer R1>
  ? R1 extends VR<infer R2>
    ? R2 extends VR<infer R3>
      ? R3 extends VR<infer R4>
        ? R4 extends VR<infer R5>
          ? R5
          : R4
        : R3
      : R2
    : R1
  : T;

type DecomposeType<T, Type> = T extends `[${infer R}]`
  ? Array<DecomposeType<R, Type>> | undefined
  : T extends `${infer R}!`
  ? NonNullable<DecomposeType<R, Type>>
  : Type | undefined;

type ExtractTypeFromGraphQLType<T extends string> = T extends keyof ZEUS_VARIABLES
  ? ZEUS_VARIABLES[T]
  : T extends keyof BuiltInVariableTypes
  ? BuiltInVariableTypes[T]
  : any;

export type GetVariableType<T extends string> = DecomposeType<
  T,
  ExtractTypeFromGraphQLType<ExtractVariableTypeString<T>>
>;

type UndefinedKeys<T> = {
  [K in keyof T]-?: T[K] extends NonNullable<T[K]> ? never : K;
}[keyof T];

type WithNullableKeys<T> = Pick<T, UndefinedKeys<T>>;
type WithNonNullableKeys<T> = Omit<T, UndefinedKeys<T>>;

type OptionalKeys<T> = {
  [P in keyof T]?: T[P];
};

export type WithOptionalNullables<T> = OptionalKeys<WithNullableKeys<T>> & WithNonNullableKeys<T>;

export type Variable<T extends GraphQLVariableType, Name extends string> = {
  ' __zeus_name': Name;
  ' __zeus_type': T;
};

export type ExtractVariables<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends [infer Inputs, infer Outputs]
  ? ExtractVariables<Inputs> & ExtractVariables<Outputs>
  : Query extends string | number | boolean
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariables<Query[K]>> }[keyof Query]>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const START_VAR_NAME = `$ZEUS_VAR`;
export const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;

export const $ = <Type extends GraphQLVariableType, Name extends string>(name: Name, graphqlType: Type) => {
  return (START_VAR_NAME + name + GRAPHQL_TYPE_SEPARATOR + graphqlType) as unknown as Variable<Type, Name>;
};
type ZEUS_INTERFACES = GraphQLTypes["BaseResult"]
export type ScalarCoders = {
	DateTime?: ScalarResolver;
	JSONObject?: ScalarResolver;
}
type ZEUS_UNIONS = never

export type ValueTypes = {
    ["Query"]: AliasType<{
	/** 获取我的信息 */
	userInfo?:ValueTypes["LoginUser"],
getOnLineLoginUserList?: [{	ip?: string | undefined | null | Variable<any, string>,	name?: string | undefined | null | Variable<any, string>},ValueTypes["OnLineUser"]],
getOauthUrl?: [{	type: string | Variable<any, string>},boolean | `@${string}`],
hello?: [{	name: string | Variable<any, string>},boolean | `@${string}`],
queryMenuList?: [{	onlyUser: boolean | Variable<any, string>},ValueTypes["Menu"]],
queryMenuTree?: [{	/** 角色id */
	id?: string | undefined | null | Variable<any, string>,	/** 类型 */
	type?: string | undefined | null | Variable<any, string>,	/** 角色名 */
	name?: string | undefined | null | Variable<any, string>,	/** 是否可见 */
	visible?: boolean | undefined | null | Variable<any, string>,	/** 开始时间YYYY-DD-MM */
	from?: string | undefined | null | Variable<any, string>,	/** 结束时间YYYY-DD-MM */
	to?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
queryRolePage?: [{	/** 角色id */
	id?: string | undefined | null | Variable<any, string>,	/** 角色名 */
	name?: string | undefined | null | Variable<any, string>,	/** 角色标识 */
	key?: string | undefined | null | Variable<any, string>,	/** 是否默认标识 */
	isDefault?: boolean | undefined | null | Variable<any, string>,	/** 开始时间YYYY-DD-MM */
	from?: string | undefined | null | Variable<any, string>,	/** 结束时间YYYY-DD-MM */
	to?: string | undefined | null | Variable<any, string>,	/** 是否默认标识 */
	includeMenu?: boolean | undefined | null | Variable<any, string>,	pageNo?: number | undefined | null | Variable<any, string>,	pageSize?: number | undefined | null | Variable<any, string>},ValueTypes["RolePageResult"]],
queryUserPage?: [{	/** 用户id */
	id?: string | undefined | null | Variable<any, string>,	/** 用户名 */
	username?: string | undefined | null | Variable<any, string>,	/** 用户手机 */
	phone?: string | undefined | null | Variable<any, string>,	/** 邮箱 */
	email?: string | undefined | null | Variable<any, string>,	/** 开始时间YYYY-DD-MM */
	from?: string | undefined | null | Variable<any, string>,	/** 结束时间YYYY-DD-MM */
	to?: string | undefined | null | Variable<any, string>,	/** 是否包含角色 */
	includeRole?: boolean | undefined | null | Variable<any, string>,	pageNo?: number | undefined | null | Variable<any, string>,	pageSize?: number | undefined | null | Variable<any, string>},ValueTypes["UserPageResult"]],
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
	/** 标题 */
	title?:boolean | `@${string}`,
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
	["OnLineUser"]: AliasType<{
	/** 登录用户名 */
	username?:boolean | `@${string}`,
	/** 浏览器 */
	loginBrowser?:boolean | `@${string}`,
	/** ip */
	loginIp?:boolean | `@${string}`,
	/** 登录时间 */
	loginTime?:boolean | `@${string}`,
	/** 登录地址 */
	loginAddr?:boolean | `@${string}`,
	/** token */
	token?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:unknown;
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
login?: [{	password: string | Variable<any, string>,	username: string | Variable<any, string>},ValueTypes["LoginResult"]],
	logout?:ValueTypes["BaseResponse"],
forceUserLogout?: [{	token: string | Variable<any, string>},ValueTypes["BaseResponse"]],
createMenu?: [{	input: ValueTypes["CreateMenuInput"] | Variable<any, string>},ValueTypes["BaseResponse"]],
updateMenu?: [{	input: ValueTypes["EditMenuInput"] | Variable<any, string>},ValueTypes["BaseResponse"]],
deleteMenus?: [{	menuIds: Array<string> | Variable<any, string>},ValueTypes["BaseResponse"]],
createRole?: [{	input: ValueTypes["CreateRoleInput"] | Variable<any, string>},ValueTypes["BaseResponse"]],
updateRole?: [{	input: ValueTypes["EditRoleInput"] | Variable<any, string>},ValueTypes["BaseResponse"]],
deleteRoles?: [{	roleIds: Array<string> | Variable<any, string>},ValueTypes["BaseResponse"]],
createUser?: [{	input: ValueTypes["CreateUserInput"] | Variable<any, string>},ValueTypes["BaseResponse"]],
updateUser?: [{	input: ValueTypes["EditUserInput"] | Variable<any, string>},ValueTypes["BaseResponse"]],
deleteUsers?: [{	userIds: Array<string> | Variable<any, string>},ValueTypes["BaseResponse"]],
resetUserPassword?: [{	userId: string | Variable<any, string>},ValueTypes["BaseResponse"]],
		__typename?: boolean | `@${string}`
}>;
	["LoginResult"]: AliasType<{
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
	name: string | Variable<any, string>,
	/** 标题 */
	title?: string | undefined | null | Variable<any, string>,
	/** 图标 */
	icon?: string | undefined | null | Variable<any, string>,
	/** 上级ID */
	pId?: string | undefined | null | Variable<any, string>,
	/** 排序 */
	orderBy?: number | undefined | null | Variable<any, string>,
	/** 路径 */
	path?: string | undefined | null | Variable<any, string>,
	/** 组件 */
	component?: string | undefined | null | Variable<any, string>,
	/** 可见 */
	visible?: boolean | undefined | null | Variable<any, string>,
	/** 权限字符 */
	permission?: string | undefined | null | Variable<any, string>,
	/** 类型 */
	type?: string | undefined | null | Variable<any, string>
};
	["EditMenuInput"]: {
	/** id */
	id: string | Variable<any, string>,
	/** 标题 */
	title?: string | undefined | null | Variable<any, string>,
	/** 菜单名 */
	name?: string | undefined | null | Variable<any, string>,
	/** 图标 */
	icon?: string | undefined | null | Variable<any, string>,
	/** 上级ID */
	pId?: string | undefined | null | Variable<any, string>,
	/** 排序 */
	orderBy?: number | undefined | null | Variable<any, string>,
	/** 路径 */
	path?: string | undefined | null | Variable<any, string>,
	/** 组件 */
	component?: string | undefined | null | Variable<any, string>,
	/** 可见 */
	visible?: boolean | undefined | null | Variable<any, string>,
	/** 权限字符 */
	permission?: string | undefined | null | Variable<any, string>,
	/** 类型 */
	type?: string | undefined | null | Variable<any, string>
};
	["CreateRoleInput"]: {
	/** 角色名 */
	name: string | Variable<any, string>,
	/** 角色标识 */
	key: string | Variable<any, string>,
	/** 权限等级 */
	level: number | Variable<any, string>,
	/** 菜单ID */
	menuIds?: Array<string> | undefined | null | Variable<any, string>
};
	["EditRoleInput"]: {
	/** 角色id */
	id: string | Variable<any, string>,
	/** 角色名 */
	name?: string | undefined | null | Variable<any, string>,
	/** 角色标识 */
	key?: string | undefined | null | Variable<any, string>,
	/** 权限等级 */
	level?: number | undefined | null | Variable<any, string>,
	/** 菜单ID */
	menuIds?: Array<string> | undefined | null | Variable<any, string>
};
	["CreateUserInput"]: {
	/** 用户名 */
	username: string | Variable<any, string>,
	/** 头像 */
	avatar?: string | undefined | null | Variable<any, string>,
	/** 密码 */
	password: string | Variable<any, string>,
	/** 性别 */
	gender?: ValueTypes["UserGenderEnum"] | undefined | null | Variable<any, string>,
	/** 邮箱 */
	email?: string | undefined | null | Variable<any, string>,
	/** 昵称 */
	nickname?: string | undefined | null | Variable<any, string>,
	/** 手机 */
	phone?: string | undefined | null | Variable<any, string>,
	/** 备注 */
	note?: string | undefined | null | Variable<any, string>,
	/** 角色 */
	roleIds?: Array<string> | undefined | null | Variable<any, string>
};
	["EditUserInput"]: {
	/** 角色id */
	id: string | Variable<any, string>,
	/** 头像 */
	avatar?: string | undefined | null | Variable<any, string>,
	/** 性别 */
	gender?: ValueTypes["UserGenderEnum"] | undefined | null | Variable<any, string>,
	/** 邮箱 */
	email?: string | undefined | null | Variable<any, string>,
	/** 昵称 */
	nickname?: string | undefined | null | Variable<any, string>,
	/** 手机 */
	phone?: string | undefined | null | Variable<any, string>,
	/** 备注 */
	note?: string | undefined | null | Variable<any, string>,
	/** 角色 */
	roleIds?: Array<string> | undefined | null | Variable<any, string>
}
  }

export type ResolverInputTypes = {
    ["Query"]: AliasType<{
	/** 获取我的信息 */
	userInfo?:ResolverInputTypes["LoginUser"],
getOnLineLoginUserList?: [{	ip?: string | undefined | null,	name?: string | undefined | null},ResolverInputTypes["OnLineUser"]],
getOauthUrl?: [{	type: string},boolean | `@${string}`],
hello?: [{	name: string},boolean | `@${string}`],
queryMenuList?: [{	onlyUser: boolean},ResolverInputTypes["Menu"]],
queryMenuTree?: [{	/** 角色id */
	id?: string | undefined | null,	/** 类型 */
	type?: string | undefined | null,	/** 角色名 */
	name?: string | undefined | null,	/** 是否可见 */
	visible?: boolean | undefined | null,	/** 开始时间YYYY-DD-MM */
	from?: string | undefined | null,	/** 结束时间YYYY-DD-MM */
	to?: string | undefined | null},boolean | `@${string}`],
queryRolePage?: [{	/** 角色id */
	id?: string | undefined | null,	/** 角色名 */
	name?: string | undefined | null,	/** 角色标识 */
	key?: string | undefined | null,	/** 是否默认标识 */
	isDefault?: boolean | undefined | null,	/** 开始时间YYYY-DD-MM */
	from?: string | undefined | null,	/** 结束时间YYYY-DD-MM */
	to?: string | undefined | null,	/** 是否默认标识 */
	includeMenu?: boolean | undefined | null,	pageNo?: number | undefined | null,	pageSize?: number | undefined | null},ResolverInputTypes["RolePageResult"]],
queryUserPage?: [{	/** 用户id */
	id?: string | undefined | null,	/** 用户名 */
	username?: string | undefined | null,	/** 用户手机 */
	phone?: string | undefined | null,	/** 邮箱 */
	email?: string | undefined | null,	/** 开始时间YYYY-DD-MM */
	from?: string | undefined | null,	/** 结束时间YYYY-DD-MM */
	to?: string | undefined | null,	/** 是否包含角色 */
	includeRole?: boolean | undefined | null,	pageNo?: number | undefined | null,	pageSize?: number | undefined | null},ResolverInputTypes["UserPageResult"]],
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
	roles?:ResolverInputTypes["Role"],
	/** 登录时间 */
	loginTime?:boolean | `@${string}`,
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
	menus?:ResolverInputTypes["Menu"],
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
	/** 标题 */
	title?:boolean | `@${string}`,
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
	children?:ResolverInputTypes["Menu"],
		__typename?: boolean | `@${string}`
}>;
	["OnLineUser"]: AliasType<{
	/** 登录用户名 */
	username?:boolean | `@${string}`,
	/** 浏览器 */
	loginBrowser?:boolean | `@${string}`,
	/** ip */
	loginIp?:boolean | `@${string}`,
	/** 登录时间 */
	loginTime?:boolean | `@${string}`,
	/** 登录地址 */
	loginAddr?:boolean | `@${string}`,
	/** token */
	token?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:unknown;
	["RolePageResult"]: AliasType<{
	data?:ResolverInputTypes["Role"],
	totalCount?:boolean | `@${string}`,
	hasNextPage?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserPageResult"]: AliasType<{
	data?:ResolverInputTypes["User"],
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
	roles?:ResolverInputTypes["Role"],
		__typename?: boolean | `@${string}`
}>;
	["Mutation"]: AliasType<{
login?: [{	password: string,	username: string},ResolverInputTypes["LoginResult"]],
	logout?:ResolverInputTypes["BaseResponse"],
forceUserLogout?: [{	token: string},ResolverInputTypes["BaseResponse"]],
createMenu?: [{	input: ResolverInputTypes["CreateMenuInput"]},ResolverInputTypes["BaseResponse"]],
updateMenu?: [{	input: ResolverInputTypes["EditMenuInput"]},ResolverInputTypes["BaseResponse"]],
deleteMenus?: [{	menuIds: Array<string>},ResolverInputTypes["BaseResponse"]],
createRole?: [{	input: ResolverInputTypes["CreateRoleInput"]},ResolverInputTypes["BaseResponse"]],
updateRole?: [{	input: ResolverInputTypes["EditRoleInput"]},ResolverInputTypes["BaseResponse"]],
deleteRoles?: [{	roleIds: Array<string>},ResolverInputTypes["BaseResponse"]],
createUser?: [{	input: ResolverInputTypes["CreateUserInput"]},ResolverInputTypes["BaseResponse"]],
updateUser?: [{	input: ResolverInputTypes["EditUserInput"]},ResolverInputTypes["BaseResponse"]],
deleteUsers?: [{	userIds: Array<string>},ResolverInputTypes["BaseResponse"]],
resetUserPassword?: [{	userId: string},ResolverInputTypes["BaseResponse"]],
		__typename?: boolean | `@${string}`
}>;
	["LoginResult"]: AliasType<{
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
		['...on BaseResponse']?: Omit<ResolverInputTypes["BaseResponse"],keyof ResolverInputTypes["BaseResult"]>;
		__typename?: boolean | `@${string}`
}>;
	["CreateMenuInput"]: {
	/** 菜单名 */
	name: string,
	/** 标题 */
	title?: string | undefined | null,
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
	/** 标题 */
	title?: string | undefined | null,
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
	gender?: ResolverInputTypes["UserGenderEnum"] | undefined | null,
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
	gender?: ResolverInputTypes["UserGenderEnum"] | undefined | null,
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
		/** 获取我的信息 */
	userInfo: ModelTypes["LoginUser"],
	/** 登录用户列表查询 */
	getOnLineLoginUserList: Array<ModelTypes["OnLineUser"]>,
	/** 获取oauth登录链接 */
	getOauthUrl: string,
	hello: string,
	/** 查询所有菜单 */
	queryMenuList: Array<ModelTypes["Menu"]>,
	/** 菜单Tree查询 */
	queryMenuTree: Array<ModelTypes["JSONObject"]>,
	/** 角色列表查询 */
	queryRolePage: ModelTypes["RolePageResult"],
	/** 角色列表查询 */
	queryUserPage: ModelTypes["UserPageResult"]
};
	["LoginUser"]: {
		id: string,
	/** 创建时间 */
	createdAt?: ModelTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["DateTime"] | undefined,
	/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string | undefined,
	/** 性别 */
	gender?: ModelTypes["UserGenderEnum"] | undefined,
	/** 邮箱 */
	email?: string | undefined,
	/** 昵称 */
	nickname?: string | undefined,
	/** 手机 */
	phone?: string | undefined,
	/** 备注 */
	note?: string | undefined,
	/** 角色 */
	roles?: Array<ModelTypes["Role"] | undefined> | undefined,
	/** 登录时间 */
	loginTime?: ModelTypes["DateTime"] | undefined,
	/** 管理员 */
	isSuperAdmin?: boolean | undefined
};
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
["DateTime"]:any;
	["UserGenderEnum"]:UserGenderEnum;
	["Role"]: {
		id: string,
	/** 创建时间 */
	createdAt?: ModelTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["DateTime"] | undefined,
	/** 角色名 */
	name: string,
	/** 角色level */
	level: number,
	/** 标识 */
	key?: string | undefined,
	/** 是否默认 */
	isDefault?: boolean | undefined,
	/** 权限菜单 */
	menus?: Array<ModelTypes["Menu"] | undefined> | undefined
};
	["Menu"]: {
		id: string,
	/** 创建时间 */
	createdAt?: ModelTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["DateTime"] | undefined,
	/** 菜单名 */
	name: string,
	/** 标题 */
	title?: string | undefined,
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
	children?: Array<ModelTypes["Menu"] | undefined> | undefined
};
	["OnLineUser"]: {
		/** 登录用户名 */
	username?: string | undefined,
	/** 浏览器 */
	loginBrowser?: string | undefined,
	/** ip */
	loginIp?: string | undefined,
	/** 登录时间 */
	loginTime?: string | undefined,
	/** 登录地址 */
	loginAddr?: string | undefined,
	/** token */
	token?: string | undefined
};
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]:any;
	["RolePageResult"]: {
		data?: Array<ModelTypes["Role"] | undefined> | undefined,
	totalCount: number,
	hasNextPage: boolean
};
	["UserPageResult"]: {
		data?: Array<ModelTypes["User"] | undefined> | undefined,
	totalCount: number,
	hasNextPage: boolean
};
	["User"]: {
		id: string,
	/** 创建时间 */
	createdAt?: ModelTypes["DateTime"] | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["DateTime"] | undefined,
	/** 用户名 */
	username: string,
	/** 头像 */
	avatar?: string | undefined,
	/** 性别 */
	gender?: ModelTypes["UserGenderEnum"] | undefined,
	/** 邮箱 */
	email?: string | undefined,
	/** 昵称 */
	nickname?: string | undefined,
	/** 手机 */
	phone?: string | undefined,
	/** 备注 */
	note?: string | undefined,
	/** 角色 */
	roles?: Array<ModelTypes["Role"] | undefined> | undefined
};
	["Mutation"]: {
		login: ModelTypes["LoginResult"],
	logout: ModelTypes["BaseResponse"],
	/** 强制用户退出 */
	forceUserLogout: ModelTypes["BaseResponse"],
	/** 创建新菜单 */
	createMenu: ModelTypes["BaseResponse"],
	/** 修改菜单信息 */
	updateMenu: ModelTypes["BaseResponse"],
	/** 批量删除用户 */
	deleteMenus: ModelTypes["BaseResponse"],
	/** 新增角色 */
	createRole: ModelTypes["BaseResponse"],
	/** 修改角色 */
	updateRole: ModelTypes["BaseResponse"],
	/** 批量删除角色 */
	deleteRoles: ModelTypes["BaseResponse"],
	/** 创建新用户 */
	createUser: ModelTypes["BaseResponse"],
	/** 修改用户信息 */
	updateUser: ModelTypes["BaseResponse"],
	/** 批量删除用户 */
	deleteUsers: ModelTypes["BaseResponse"],
	/** 重置用户密码 */
	resetUserPassword: ModelTypes["BaseResponse"]
};
	["LoginResult"]: {
		/** accessToken */
	accessToken: string
};
	["BaseResponse"]: {
		code: number,
	msg: string
};
	["BaseResult"]: ModelTypes["BaseResponse"];
	["CreateMenuInput"]: {
	/** 菜单名 */
	name: string,
	/** 标题 */
	title?: string | undefined,
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
	/** 标题 */
	title?: string | undefined,
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
	gender?: ModelTypes["UserGenderEnum"] | undefined,
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
	gender?: ModelTypes["UserGenderEnum"] | undefined,
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

export type GraphQLTypes = {
    ["Query"]: {
	__typename: "Query",
	/** 获取我的信息 */
	userInfo: GraphQLTypes["LoginUser"],
	/** 登录用户列表查询 */
	getOnLineLoginUserList: Array<GraphQLTypes["OnLineUser"]>,
	/** 获取oauth登录链接 */
	getOauthUrl: string,
	hello: string,
	/** 查询所有菜单 */
	queryMenuList: Array<GraphQLTypes["Menu"]>,
	/** 菜单Tree查询 */
	queryMenuTree: Array<GraphQLTypes["JSONObject"]>,
	/** 角色列表查询 */
	queryRolePage: GraphQLTypes["RolePageResult"],
	/** 角色列表查询 */
	queryUserPage: GraphQLTypes["UserPageResult"]
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
	/** 管理员 */
	isSuperAdmin?: boolean | undefined
};
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
["DateTime"]: "scalar" & { name: "DateTime" };
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
	/** 标题 */
	title?: string | undefined,
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
	["OnLineUser"]: {
	__typename: "OnLineUser",
	/** 登录用户名 */
	username?: string | undefined,
	/** 浏览器 */
	loginBrowser?: string | undefined,
	/** ip */
	loginIp?: string | undefined,
	/** 登录时间 */
	loginTime?: string | undefined,
	/** 登录地址 */
	loginAddr?: string | undefined,
	/** token */
	token?: string | undefined
};
	/** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
["JSONObject"]: "scalar" & { name: "JSONObject" };
	["RolePageResult"]: {
	__typename: "RolePageResult",
	data?: Array<GraphQLTypes["Role"] | undefined> | undefined,
	totalCount: number,
	hasNextPage: boolean
};
	["UserPageResult"]: {
	__typename: "UserPageResult",
	data?: Array<GraphQLTypes["User"] | undefined> | undefined,
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
	/** 强制用户退出 */
	forceUserLogout: GraphQLTypes["BaseResponse"],
	/** 创建新菜单 */
	createMenu: GraphQLTypes["BaseResponse"],
	/** 修改菜单信息 */
	updateMenu: GraphQLTypes["BaseResponse"],
	/** 批量删除用户 */
	deleteMenus: GraphQLTypes["BaseResponse"],
	/** 新增角色 */
	createRole: GraphQLTypes["BaseResponse"],
	/** 修改角色 */
	updateRole: GraphQLTypes["BaseResponse"],
	/** 批量删除角色 */
	deleteRoles: GraphQLTypes["BaseResponse"],
	/** 创建新用户 */
	createUser: GraphQLTypes["BaseResponse"],
	/** 修改用户信息 */
	updateUser: GraphQLTypes["BaseResponse"],
	/** 批量删除用户 */
	deleteUsers: GraphQLTypes["BaseResponse"],
	/** 重置用户密码 */
	resetUserPassword: GraphQLTypes["BaseResponse"]
};
	["LoginResult"]: {
	__typename: "LoginResult",
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
	/** 标题 */
	title?: string | undefined,
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
	/** 标题 */
	title?: string | undefined,
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

type ZEUS_VARIABLES = {
	["DateTime"]: ValueTypes["DateTime"];
	["UserGenderEnum"]: ValueTypes["UserGenderEnum"];
	["JSONObject"]: ValueTypes["JSONObject"];
	["CreateMenuInput"]: ValueTypes["CreateMenuInput"];
	["EditMenuInput"]: ValueTypes["EditMenuInput"];
	["CreateRoleInput"]: ValueTypes["CreateRoleInput"];
	["EditRoleInput"]: ValueTypes["EditRoleInput"];
	["CreateUserInput"]: ValueTypes["CreateUserInput"];
	["EditUserInput"]: ValueTypes["EditUserInput"];
}