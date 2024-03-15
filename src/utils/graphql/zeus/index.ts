/* eslint-disable */

import { AllTypesProps, ReturnTypes, Ops } from './const';
export const HOST = "http://localhost:8080/graphql"


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
  <Z extends ValueTypes[R]>(
    o: (Z & ValueTypes[R]) | ValueTypes[R],
    ops?: OperationOptions & { variables?: Record<string, unknown> },
  ) =>
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
  <Z extends ValueTypes[R]>(
    o: (Z & ValueTypes[R]) | ValueTypes[R],
    ops?: OperationOptions & { variables?: ExtractVariables<Z> },
  ) => {
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
  o: (Z & ValueTypes[R]) | ValueTypes[R],
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
          : IsArray<R, '__typename' extends keyof DST ? { __typename: true } : Record<string, never>, SCLR>
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

export type ExtractVariablesDeep<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariablesDeep<Query[K]>> }[keyof Query]>;

export type ExtractVariables<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends [infer Inputs, infer Outputs]
  ? ExtractVariablesDeep<Inputs> & ExtractVariables<Outputs>
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariables<Query[K]>> }[keyof Query]>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const START_VAR_NAME = `$ZEUS_VAR`;
export const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;

export const $ = <Type extends GraphQLVariableType, Name extends string>(name: Name, graphqlType: Type) => {
  return (START_VAR_NAME + name + GRAPHQL_TYPE_SEPARATOR + graphqlType) as unknown as Variable<Type, Name>;
};
type ZEUS_INTERFACES = GraphQLTypes["BaseEntity"]
export type ScalarCoders = {
	LocalDate?: ScalarResolver;
	LocalDateTime?: ScalarResolver;
	Long?: ScalarResolver;
}
type ZEUS_UNIONS = never

export type ValueTypes = {
    ["Article"]: AliasType<{
	author?:ValueTypes["User"],
	authorId?:boolean | `@${string}`,
	category?:ValueTypes["ArticleCategory"],
	categoryId?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	html?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	markdown?:boolean | `@${string}`,
	metaDescription?:boolean | `@${string}`,
	metaTitle?:boolean | `@${string}`,
	publishedAt?:boolean | `@${string}`,
	publishedBy?:boolean | `@${string}`,
	status?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ArticleCategory"]: AliasType<{
	articles?:ValueTypes["Article"],
	children?:ValueTypes["ArticleCategory"],
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	icon?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	parent?:ValueTypes["ArticleCategory"],
	parentId?:boolean | `@${string}`,
	sort?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ArticleStatusEnum"]:ArticleStatusEnum;
	["BaseEntity"]:AliasType<{
		/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`;
		['...on Article']?: Omit<ValueTypes["Article"],keyof ValueTypes["BaseEntity"]>;
		['...on ArticleCategory']?: Omit<ValueTypes["ArticleCategory"],keyof ValueTypes["BaseEntity"]>;
		['...on Comment']?: Omit<ValueTypes["Comment"],keyof ValueTypes["BaseEntity"]>;
		['...on File']?: Omit<ValueTypes["File"],keyof ValueTypes["BaseEntity"]>;
		['...on Menu']?: Omit<ValueTypes["Menu"],keyof ValueTypes["BaseEntity"]>;
		['...on Org']?: Omit<ValueTypes["Org"],keyof ValueTypes["BaseEntity"]>;
		['...on Role']?: Omit<ValueTypes["Role"],keyof ValueTypes["BaseEntity"]>;
		['...on StudyPlan']?: Omit<ValueTypes["StudyPlan"],keyof ValueTypes["BaseEntity"]>;
		['...on User']?: Omit<ValueTypes["User"],keyof ValueTypes["BaseEntity"]>;
		['...on WordRecord']?: Omit<ValueTypes["WordRecord"],keyof ValueTypes["BaseEntity"]>;
		__typename?: boolean | `@${string}`
}>;
	["Comment"]: AliasType<{
	content?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	ip?:boolean | `@${string}`,
	location?:boolean | `@${string}`,
	org?:ValueTypes["Org"],
	orgId?:boolean | `@${string}`,
	type?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	user?:ValueTypes["User"],
	userId?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["CreateArticleCategoryInputInput"]: {
	icon?: string | undefined | null | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	parentId?: string | undefined | null | Variable<any, string>,
	sort?: number | undefined | null | Variable<any, string>
};
	["CreateArticleInputInput"]: {
	html?: string | undefined | null | Variable<any, string>,
	image?: string | undefined | null | Variable<any, string>,
	markdown?: string | undefined | null | Variable<any, string>,
	metaDescription?: string | undefined | null | Variable<any, string>,
	metaTitle?: string | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>
};
	["CreateCommentInputInput"]: {
	content?: string | undefined | null | Variable<any, string>,
	orgId?: string | undefined | null | Variable<any, string>,
	type?: string | undefined | null | Variable<any, string>
};
	["CreateMenuInputInput"]: {
	component?: string | undefined | null | Variable<any, string>,
	frame?: boolean | undefined | null | Variable<any, string>,
	icon?: string | undefined | null | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	parentId?: string | undefined | null | Variable<any, string>,
	path?: string | undefined | null | Variable<any, string>,
	permission?: string | undefined | null | Variable<any, string>,
	sort?: number | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>,
	type?: ValueTypes["MenuTypeEnum"] | undefined | null | Variable<any, string>,
	visible?: boolean | undefined | null | Variable<any, string>
};
	["CreateOrgInputInput"]: {
	address?: string | undefined | null | Variable<any, string>,
	latitude: number | Variable<any, string>,
	leadId?: string | undefined | null | Variable<any, string>,
	longitude: number | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	openTime?: string | undefined | null | Variable<any, string>,
	orgType?: ValueTypes["OrgTypeEnum"] | undefined | null | Variable<any, string>
};
	["CreateRoleInputInput"]: {
	key?: string | undefined | null | Variable<any, string>,
	level?: number | undefined | null | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>
};
	["CreateUserInputInput"]: {
	avatar?: string | undefined | null | Variable<any, string>,
	email?: string | undefined | null | Variable<any, string>,
	gender?: ValueTypes["GenderEnum"] | undefined | null | Variable<any, string>,
	job?: string | undefined | null | Variable<any, string>,
	nickName?: string | undefined | null | Variable<any, string>,
	note?: string | undefined | null | Variable<any, string>,
	orgId?: string | undefined | null | Variable<any, string>,
	password?: string | undefined | null | Variable<any, string>,
	phone?: string | undefined | null | Variable<any, string>,
	roleIds?: Array<string | undefined | null> | undefined | null | Variable<any, string>,
	userName?: string | undefined | null | Variable<any, string>
};
	["DefaultRoleEnum"]:DefaultRoleEnum;
	["Direction"]:Direction;
	["File"]: AliasType<{
	bucket?:boolean | `@${string}`,
	category?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	fileHash?:boolean | `@${string}`,
	fileName?:boolean | `@${string}`,
	fileSize?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	mimeType?:boolean | `@${string}`,
	originName?:boolean | `@${string}`,
	provider?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	url?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["FileProviderEnum"]:FileProviderEnum;
	["FileQueryPageParamInput"]: {
	createdAtFrom?: string | undefined | null | Variable<any, string>,
	createdAtTo?: string | undefined | null | Variable<any, string>,
	fileName?: string | undefined | null | Variable<any, string>,
	originName?: string | undefined | null | Variable<any, string>,
	pageNo?: number | undefined | null | Variable<any, string>,
	pageSize?: number | undefined | null | Variable<any, string>,
	provider?: ValueTypes["FileProviderEnum"] | undefined | null | Variable<any, string>,
	sort?: string | undefined | null | Variable<any, string>
};
	["GenderEnum"]:GenderEnum;
	/** Built-in scalar representing a local date */
["LocalDate"]:unknown;
	/** Built-in scalar representing a local date-time */
["LocalDateTime"]:unknown;
	["LoginSessionResult"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	current?:boolean | `@${string}`,
	expired?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	ip?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** A 64-bit signed integer */
["Long"]:unknown;
	["Menu"]: AliasType<{
	children?:ValueTypes["Menu"],
	component?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	frame?:boolean | `@${string}`,
	icon?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	parent?:ValueTypes["Menu"],
	parentId?:boolean | `@${string}`,
	path?:boolean | `@${string}`,
	permission?:boolean | `@${string}`,
	roles?:ValueTypes["Role"],
	sort?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	type?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	visible?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["MenuQueryPageParamInput"]: {
	name?: string | undefined | null | Variable<any, string>,
	permission?: string | undefined | null | Variable<any, string>,
	sort: string | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>,
	type?: string | undefined | null | Variable<any, string>,
	userId?: string | undefined | null | Variable<any, string>,
	visible?: boolean | undefined | null | Variable<any, string>
};
	["MenuQueryParamInput"]: {
	name?: string | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>,
	type?: ValueTypes["MenuTypeEnum"] | undefined | null | Variable<any, string>,
	userId?: string | undefined | null | Variable<any, string>,
	visible?: boolean | undefined | null | Variable<any, string>
};
	["MenuTypeEnum"]:MenuTypeEnum;
	/** Mutation root */
["Mutation"]: AliasType<{
deleteMenu?: [{	menuId?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
unpublishArticle?: [{	id?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
updateArticle?: [{	input?: ValueTypes["UpdateArticleInputInput"] | undefined | null | Variable<any, string>},ValueTypes["Article"]],
updateRole?: [{	input: ValueTypes["UpdateRoleInputInput"] | Variable<any, string>},ValueTypes["Role"]],
updateArticleCategory?: [{	input?: ValueTypes["UpdateArticleCategoryInputInput"] | undefined | null | Variable<any, string>},ValueTypes["ArticleCategory"]],
createArticleCategory?: [{	input?: ValueTypes["CreateArticleCategoryInputInput"] | undefined | null | Variable<any, string>},ValueTypes["ArticleCategory"]],
deleteComment?: [{	id?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
createRole?: [{	input: ValueTypes["CreateRoleInputInput"] | Variable<any, string>},ValueTypes["Role"]],
revoke?: [{	id?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
updateOrg?: [{	input?: ValueTypes["UpdateOrgInputInput"] | undefined | null | Variable<any, string>},ValueTypes["Org"]],
createComment?: [{	input?: ValueTypes["CreateCommentInputInput"] | undefined | null | Variable<any, string>},ValueTypes["Comment"]],
updateMenu?: [{	input: ValueTypes["UpdateMenuInputInput"] | Variable<any, string>},ValueTypes["Menu"]],
	logout?:boolean | `@${string}`,
createOrg?: [{	input?: ValueTypes["CreateOrgInputInput"] | undefined | null | Variable<any, string>},ValueTypes["Org"]],
createMenu?: [{	input: ValueTypes["CreateMenuInputInput"] | Variable<any, string>},ValueTypes["Menu"]],
deleteArticleCategory?: [{	id?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
createArticle?: [{	input?: ValueTypes["CreateArticleInputInput"] | undefined | null | Variable<any, string>},ValueTypes["Article"]],
deleteOrg?: [{	id?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
updateRoleMenu?: [{	input: ValueTypes["UpdateRoleMenuInputInput"] | Variable<any, string>},boolean | `@${string}`],
publishArticle?: [{	id?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
updateUser?: [{	input: ValueTypes["UpdateUserInputInput"] | Variable<any, string>},ValueTypes["User"]],
deleteRole?: [{	roleId?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
updateComment?: [{	input?: ValueTypes["UpdateCommentInputInput"] | undefined | null | Variable<any, string>},ValueTypes["Comment"]],
deleteArticle?: [{	id?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
updateUserProfile?: [{	input?: ValueTypes["UpdateUserProfileInputInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
deleteUser?: [{	userId: string | Variable<any, string>},boolean | `@${string}`],
registerUser?: [{	input?: ValueTypes["UserRegisterInputInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
loginByAccount?: [{	input?: ValueTypes["UserLoginInputInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
createUser?: [{	input: ValueTypes["CreateUserInputInput"] | Variable<any, string>},ValueTypes["User"]],
deleteFileById?: [{	id?: string | undefined | null | Variable<any, string>},boolean | `@${string}`],
		__typename?: boolean | `@${string}`
}>;
	["NullHandling"]:NullHandling;
	["Order"]: AliasType<{
	direction?:boolean | `@${string}`,
	ignoreCase?:boolean | `@${string}`,
	nullHandlingHint?:boolean | `@${string}`,
	property?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Org"]: AliasType<{
	address?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	latitude?:boolean | `@${string}`,
	lead?:ValueTypes["User"],
	leadId?:boolean | `@${string}`,
	longitude?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	openTime?:boolean | `@${string}`,
	orgType?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["OrgTypeEnum"]:OrgTypeEnum;
	["Page_Article"]: AliasType<{
	content?:ValueTypes["Article"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ValueTypes["Pagination"],
	nextPageable?:ValueTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ValueTypes["Pagination"],
	previousOrFirstPageable?:ValueTypes["Pagination"],
	previousPageable?:ValueTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ValueTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_Comment"]: AliasType<{
	content?:ValueTypes["Comment"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ValueTypes["Pagination"],
	nextPageable?:ValueTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ValueTypes["Pagination"],
	previousOrFirstPageable?:ValueTypes["Pagination"],
	previousPageable?:ValueTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ValueTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_File"]: AliasType<{
	content?:ValueTypes["File"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ValueTypes["Pagination"],
	nextPageable?:ValueTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ValueTypes["Pagination"],
	previousOrFirstPageable?:ValueTypes["Pagination"],
	previousPageable?:ValueTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ValueTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_Org"]: AliasType<{
	content?:ValueTypes["Org"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ValueTypes["Pagination"],
	nextPageable?:ValueTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ValueTypes["Pagination"],
	previousOrFirstPageable?:ValueTypes["Pagination"],
	previousPageable?:ValueTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ValueTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_Role"]: AliasType<{
	content?:ValueTypes["Role"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ValueTypes["Pagination"],
	nextPageable?:ValueTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ValueTypes["Pagination"],
	previousOrFirstPageable?:ValueTypes["Pagination"],
	previousPageable?:ValueTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ValueTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_StudyPlan"]: AliasType<{
	content?:ValueTypes["StudyPlan"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ValueTypes["Pagination"],
	nextPageable?:ValueTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ValueTypes["Pagination"],
	previousOrFirstPageable?:ValueTypes["Pagination"],
	previousPageable?:ValueTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ValueTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_User"]: AliasType<{
	content?:ValueTypes["User"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ValueTypes["Pagination"],
	nextPageable?:ValueTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ValueTypes["Pagination"],
	previousOrFirstPageable?:ValueTypes["Pagination"],
	previousPageable?:ValueTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ValueTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_WordRecord"]: AliasType<{
	content?:ValueTypes["WordRecord"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ValueTypes["Pagination"],
	nextPageable?:ValueTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ValueTypes["Pagination"],
	previousOrFirstPageable?:ValueTypes["Pagination"],
	previousPageable?:ValueTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ValueTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Pagination"]: AliasType<{
	pageNumber?:boolean | `@${string}`,
	pageSize?:boolean | `@${string}`,
	sort?:ValueTypes["Sort"],
		__typename?: boolean | `@${string}`
}>;
	/** Query root */
["Query"]: AliasType<{
	app?:boolean | `@${string}`,
	userInfo?:ValueTypes["UserInfoResult"],
queryMenuList?: [{	param?: ValueTypes["MenuQueryParamInput"] | undefined | null | Variable<any, string>},ValueTypes["Menu"]],
queryCommentPage?: [{	specification?: ValueTypes["QueryCommentPageSpecificationInput"] | undefined | null | Variable<any, string>},ValueTypes["Page_Comment"]],
	queryArticleCategoryTree?:ValueTypes["ArticleCategory"],
queryUserPage?: [{	specification: ValueTypes["QueryUserPageSpecificationInput"] | Variable<any, string>},ValueTypes["Page_User"]],
queryStudyPlanPage?: [{	specification?: ValueTypes["QueryStudyPlanPageSpecificationInput"] | undefined | null | Variable<any, string>},ValueTypes["Page_StudyPlan"]],
queryArticle?: [{	id?: string | undefined | null | Variable<any, string>},ValueTypes["Article"]],
queryMenuTree?: [{	param?: ValueTypes["MenuQueryPageParamInput"] | undefined | null | Variable<any, string>},ValueTypes["Menu"]],
queryRolePage?: [{	param?: ValueTypes["RoleQueryParamInput"] | undefined | null | Variable<any, string>},ValueTypes["Page_Role"]],
	queryLoginSessionList?:ValueTypes["LoginSessionResult"],
queryRole?: [{	roleId?: string | undefined | null | Variable<any, string>},ValueTypes["Role"]],
queryUserList?: [{	specification?: ValueTypes["QueryUserSpecificationInput"] | undefined | null | Variable<any, string>},ValueTypes["User"]],
	queryAllRoleList?:ValueTypes["Role"],
	queryDefaultRole?:boolean | `@${string}`,
queryArticlePage?: [{	specification?: ValueTypes["QueryArticlePageSpecificationInput"] | undefined | null | Variable<any, string>},ValueTypes["Page_Article"]],
queryWordRecordPage?: [{	specification?: ValueTypes["QueryWordRecordPageSpecificationInput"] | undefined | null | Variable<any, string>},ValueTypes["Page_WordRecord"]],
queryOrgPage?: [{	specification?: ValueTypes["QueryOrgPageSpecificationInput"] | undefined | null | Variable<any, string>},ValueTypes["Page_Org"]],
queryFilePage?: [{	param?: ValueTypes["FileQueryPageParamInput"] | undefined | null | Variable<any, string>},ValueTypes["Page_File"]],
queryUser?: [{	userId?: string | undefined | null | Variable<any, string>},ValueTypes["User"]],
queryArticleCategory?: [{	specification?: ValueTypes["QueryArticleCategorySpecificationInput"] | undefined | null | Variable<any, string>},ValueTypes["ArticleCategory"]],
setDayPlanAndName?: [{	input?: ValueTypes["SetPlanAndNickNameInputInput"] | undefined | null | Variable<any, string>},boolean | `@${string}`],
		__typename?: boolean | `@${string}`
}>;
	["QueryArticleCategorySpecificationInput"]: {
	name?: string | undefined | null | Variable<any, string>,
	parentId?: string | undefined | null | Variable<any, string>
};
	["QueryArticlePageSpecificationInput"]: {
	markdown?: string | undefined | null | Variable<any, string>,
	pageNo: number | Variable<any, string>,
	pageSize: number | Variable<any, string>,
	sort?: string | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>
};
	["QueryCommentPageSpecificationInput"]: {
	orgId?: string | undefined | null | Variable<any, string>,
	orgName?: string | undefined | null | Variable<any, string>,
	pageNo: number | Variable<any, string>,
	pageSize: number | Variable<any, string>,
	sort?: string | undefined | null | Variable<any, string>,
	type?: string | undefined | null | Variable<any, string>,
	userId?: string | undefined | null | Variable<any, string>,
	userName?: string | undefined | null | Variable<any, string>
};
	["QueryOrgPageSpecificationInput"]: {
	address?: string | undefined | null | Variable<any, string>,
	lat?: number | undefined | null | Variable<any, string>,
	lng?: number | undefined | null | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	orgType?: ValueTypes["OrgTypeEnum"] | undefined | null | Variable<any, string>,
	pageNo: number | Variable<any, string>,
	pageSize: number | Variable<any, string>,
	sort?: string | undefined | null | Variable<any, string>
};
	["QueryStudyPlanPageSpecificationInput"]: {
	pageNo: number | Variable<any, string>,
	pageSize: number | Variable<any, string>,
	sort?: string | undefined | null | Variable<any, string>
};
	["QueryUserPageSpecificationInput"]: {
	email?: string | undefined | null | Variable<any, string>,
	nickName?: string | undefined | null | Variable<any, string>,
	orgId?: string | undefined | null | Variable<any, string>,
	pageNo: number | Variable<any, string>,
	pageSize: number | Variable<any, string>,
	phone?: string | undefined | null | Variable<any, string>,
	roleIds?: Array<string | undefined | null> | undefined | null | Variable<any, string>,
	roleKey?: string | undefined | null | Variable<any, string>,
	sort?: string | undefined | null | Variable<any, string>,
	userName?: string | undefined | null | Variable<any, string>
};
	["QueryUserSpecificationInput"]: {
	key?: string | undefined | null | Variable<any, string>,
	nickName?: string | undefined | null | Variable<any, string>,
	userName?: string | undefined | null | Variable<any, string>
};
	["QueryWordRecordPageSpecificationInput"]: {
	pageNo: number | Variable<any, string>,
	pageSize: number | Variable<any, string>,
	sort?: string | undefined | null | Variable<any, string>,
	type?: string | undefined | null | Variable<any, string>
};
	["Role"]: AliasType<{
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	default?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	key?:boolean | `@${string}`,
	level?:boolean | `@${string}`,
	menuIds?:boolean | `@${string}`,
	menus?:ValueTypes["Menu"],
	name?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	users?:ValueTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["RoleQueryParamInput"]: {
	createdAtFrom?: string | undefined | null | Variable<any, string>,
	createdAtTo?: string | undefined | null | Variable<any, string>,
	key?: string | undefined | null | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	pageNo?: number | undefined | null | Variable<any, string>,
	pageSize?: number | undefined | null | Variable<any, string>,
	sort?: string | undefined | null | Variable<any, string>
};
	["SetPlanAndNickNameInputInput"]: {
	dayCount?: number | undefined | null | Variable<any, string>,
	nickName?: string | undefined | null | Variable<any, string>
};
	["Sort"]: AliasType<{
	orders?:ValueTypes["Order"],
		__typename?: boolean | `@${string}`
}>;
	["Sorting"]: AliasType<{
	orders?:ValueTypes["Order"],
		__typename?: boolean | `@${string}`
}>;
	["StudyPlan"]: AliasType<{
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	date?:boolean | `@${string}`,
	dayCount?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	planCount?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	user?:ValueTypes["User"],
	userId?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UpdateArticleCategoryInputInput"]: {
	icon?: string | undefined | null | Variable<any, string>,
	/** id */
	id?: string | undefined | null | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	parentId?: string | undefined | null | Variable<any, string>,
	sort?: number | undefined | null | Variable<any, string>
};
	["UpdateArticleInputInput"]: {
	html?: string | undefined | null | Variable<any, string>,
	/** id */
	id?: string | undefined | null | Variable<any, string>,
	image?: string | undefined | null | Variable<any, string>,
	markdown?: string | undefined | null | Variable<any, string>,
	metaDescription?: string | undefined | null | Variable<any, string>,
	metaTitle?: string | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>
};
	["UpdateCommentInputInput"]: {
	content?: string | undefined | null | Variable<any, string>,
	/** id */
	id?: string | undefined | null | Variable<any, string>
};
	["UpdateMenuInputInput"]: {
	component?: string | undefined | null | Variable<any, string>,
	frame?: boolean | undefined | null | Variable<any, string>,
	icon?: string | undefined | null | Variable<any, string>,
	/** id */
	id?: string | undefined | null | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	parentId?: string | undefined | null | Variable<any, string>,
	path?: string | undefined | null | Variable<any, string>,
	permission?: string | undefined | null | Variable<any, string>,
	sort?: number | undefined | null | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>,
	type?: ValueTypes["MenuTypeEnum"] | undefined | null | Variable<any, string>,
	visible?: boolean | undefined | null | Variable<any, string>
};
	["UpdateOrgInputInput"]: {
	address?: string | undefined | null | Variable<any, string>,
	/** id */
	id?: string | undefined | null | Variable<any, string>,
	latitude: number | Variable<any, string>,
	leadId?: string | undefined | null | Variable<any, string>,
	longitude: number | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>,
	openTime?: string | undefined | null | Variable<any, string>,
	orgType?: ValueTypes["OrgTypeEnum"] | undefined | null | Variable<any, string>
};
	["UpdateRoleInputInput"]: {
	/** id */
	id?: string | undefined | null | Variable<any, string>,
	key?: string | undefined | null | Variable<any, string>,
	level?: number | undefined | null | Variable<any, string>,
	name?: string | undefined | null | Variable<any, string>
};
	["UpdateRoleMenuInputInput"]: {
	/** id */
	id?: string | undefined | null | Variable<any, string>,
	menuIds?: Array<string | undefined | null> | undefined | null | Variable<any, string>
};
	["UpdateUserInputInput"]: {
	avatar?: string | undefined | null | Variable<any, string>,
	email?: string | undefined | null | Variable<any, string>,
	gender?: ValueTypes["GenderEnum"] | undefined | null | Variable<any, string>,
	/** id */
	id?: string | undefined | null | Variable<any, string>,
	job?: string | undefined | null | Variable<any, string>,
	nickName?: string | undefined | null | Variable<any, string>,
	note?: string | undefined | null | Variable<any, string>,
	orgId?: string | undefined | null | Variable<any, string>,
	phone?: string | undefined | null | Variable<any, string>,
	roleIds?: Array<string | undefined | null> | undefined | null | Variable<any, string>,
	userName?: string | undefined | null | Variable<any, string>
};
	["UpdateUserProfileInputInput"]: {
	avatar?: string | undefined | null | Variable<any, string>,
	nickName?: string | undefined | null | Variable<any, string>,
	oldPassword?: string | undefined | null | Variable<any, string>,
	password?: string | undefined | null | Variable<any, string>
};
	["User"]: AliasType<{
	avatar?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	dayCount?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	gender?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	job?:boolean | `@${string}`,
	nickName?:boolean | `@${string}`,
	note?:boolean | `@${string}`,
	org?:ValueTypes["Org"],
	orgId?:boolean | `@${string}`,
	phone?:boolean | `@${string}`,
	roles?:ValueTypes["Role"],
	totalCount?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	userName?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserInfoResult"]: AliasType<{
	avatar?:boolean | `@${string}`,
	dayCount?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	gender?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	menus?:ValueTypes["Menu"],
	nickName?:boolean | `@${string}`,
	passwordEnable?:boolean | `@${string}`,
	permissions?:boolean | `@${string}`,
	phone?:boolean | `@${string}`,
	roles?:ValueTypes["Role"],
	superAdmin?:boolean | `@${string}`,
	totalCount?:boolean | `@${string}`,
	userName?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserLoginInputInput"]: {
	/** 用户名 */
	account?: string | undefined | null | Variable<any, string>,
	/** 密码 */
	password?: string | undefined | null | Variable<any, string>
};
	["UserRegisterInputInput"]: {
	account?: string | undefined | null | Variable<any, string>,
	email?: string | undefined | null | Variable<any, string>,
	nickName?: string | undefined | null | Variable<any, string>,
	password?: string | undefined | null | Variable<any, string>,
	phone?: string | undefined | null | Variable<any, string>
};
	["WordRecord"]: AliasType<{
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	detail?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	type?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	user?:ValueTypes["User"],
	userId?:boolean | `@${string}`,
	word?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>
  }

export type ResolverInputTypes = {
    ["Article"]: AliasType<{
	author?:ResolverInputTypes["User"],
	authorId?:boolean | `@${string}`,
	category?:ResolverInputTypes["ArticleCategory"],
	categoryId?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	html?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	markdown?:boolean | `@${string}`,
	metaDescription?:boolean | `@${string}`,
	metaTitle?:boolean | `@${string}`,
	publishedAt?:boolean | `@${string}`,
	publishedBy?:boolean | `@${string}`,
	status?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ArticleCategory"]: AliasType<{
	articles?:ResolverInputTypes["Article"],
	children?:ResolverInputTypes["ArticleCategory"],
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	icon?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	parent?:ResolverInputTypes["ArticleCategory"],
	parentId?:boolean | `@${string}`,
	sort?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ArticleStatusEnum"]:ArticleStatusEnum;
	["BaseEntity"]:AliasType<{
		/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`;
		['...on Article']?: Omit<ResolverInputTypes["Article"],keyof ResolverInputTypes["BaseEntity"]>;
		['...on ArticleCategory']?: Omit<ResolverInputTypes["ArticleCategory"],keyof ResolverInputTypes["BaseEntity"]>;
		['...on Comment']?: Omit<ResolverInputTypes["Comment"],keyof ResolverInputTypes["BaseEntity"]>;
		['...on File']?: Omit<ResolverInputTypes["File"],keyof ResolverInputTypes["BaseEntity"]>;
		['...on Menu']?: Omit<ResolverInputTypes["Menu"],keyof ResolverInputTypes["BaseEntity"]>;
		['...on Org']?: Omit<ResolverInputTypes["Org"],keyof ResolverInputTypes["BaseEntity"]>;
		['...on Role']?: Omit<ResolverInputTypes["Role"],keyof ResolverInputTypes["BaseEntity"]>;
		['...on StudyPlan']?: Omit<ResolverInputTypes["StudyPlan"],keyof ResolverInputTypes["BaseEntity"]>;
		['...on User']?: Omit<ResolverInputTypes["User"],keyof ResolverInputTypes["BaseEntity"]>;
		['...on WordRecord']?: Omit<ResolverInputTypes["WordRecord"],keyof ResolverInputTypes["BaseEntity"]>;
		__typename?: boolean | `@${string}`
}>;
	["Comment"]: AliasType<{
	content?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	ip?:boolean | `@${string}`,
	location?:boolean | `@${string}`,
	org?:ResolverInputTypes["Org"],
	orgId?:boolean | `@${string}`,
	type?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	user?:ResolverInputTypes["User"],
	userId?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["CreateArticleCategoryInputInput"]: {
	icon?: string | undefined | null,
	name?: string | undefined | null,
	parentId?: string | undefined | null,
	sort?: number | undefined | null
};
	["CreateArticleInputInput"]: {
	html?: string | undefined | null,
	image?: string | undefined | null,
	markdown?: string | undefined | null,
	metaDescription?: string | undefined | null,
	metaTitle?: string | undefined | null,
	title?: string | undefined | null
};
	["CreateCommentInputInput"]: {
	content?: string | undefined | null,
	orgId?: string | undefined | null,
	type?: string | undefined | null
};
	["CreateMenuInputInput"]: {
	component?: string | undefined | null,
	frame?: boolean | undefined | null,
	icon?: string | undefined | null,
	name?: string | undefined | null,
	parentId?: string | undefined | null,
	path?: string | undefined | null,
	permission?: string | undefined | null,
	sort?: number | undefined | null,
	title?: string | undefined | null,
	type?: ResolverInputTypes["MenuTypeEnum"] | undefined | null,
	visible?: boolean | undefined | null
};
	["CreateOrgInputInput"]: {
	address?: string | undefined | null,
	latitude: number,
	leadId?: string | undefined | null,
	longitude: number,
	name?: string | undefined | null,
	openTime?: string | undefined | null,
	orgType?: ResolverInputTypes["OrgTypeEnum"] | undefined | null
};
	["CreateRoleInputInput"]: {
	key?: string | undefined | null,
	level?: number | undefined | null,
	name?: string | undefined | null
};
	["CreateUserInputInput"]: {
	avatar?: string | undefined | null,
	email?: string | undefined | null,
	gender?: ResolverInputTypes["GenderEnum"] | undefined | null,
	job?: string | undefined | null,
	nickName?: string | undefined | null,
	note?: string | undefined | null,
	orgId?: string | undefined | null,
	password?: string | undefined | null,
	phone?: string | undefined | null,
	roleIds?: Array<string | undefined | null> | undefined | null,
	userName?: string | undefined | null
};
	["DefaultRoleEnum"]:DefaultRoleEnum;
	["Direction"]:Direction;
	["File"]: AliasType<{
	bucket?:boolean | `@${string}`,
	category?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	fileHash?:boolean | `@${string}`,
	fileName?:boolean | `@${string}`,
	fileSize?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	mimeType?:boolean | `@${string}`,
	originName?:boolean | `@${string}`,
	provider?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	url?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["FileProviderEnum"]:FileProviderEnum;
	["FileQueryPageParamInput"]: {
	createdAtFrom?: string | undefined | null,
	createdAtTo?: string | undefined | null,
	fileName?: string | undefined | null,
	originName?: string | undefined | null,
	pageNo?: number | undefined | null,
	pageSize?: number | undefined | null,
	provider?: ResolverInputTypes["FileProviderEnum"] | undefined | null,
	sort?: string | undefined | null
};
	["GenderEnum"]:GenderEnum;
	/** Built-in scalar representing a local date */
["LocalDate"]:unknown;
	/** Built-in scalar representing a local date-time */
["LocalDateTime"]:unknown;
	["LoginSessionResult"]: AliasType<{
	createdAt?:boolean | `@${string}`,
	current?:boolean | `@${string}`,
	expired?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	ip?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	/** A 64-bit signed integer */
["Long"]:unknown;
	["Menu"]: AliasType<{
	children?:ResolverInputTypes["Menu"],
	component?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	frame?:boolean | `@${string}`,
	icon?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	parent?:ResolverInputTypes["Menu"],
	parentId?:boolean | `@${string}`,
	path?:boolean | `@${string}`,
	permission?:boolean | `@${string}`,
	roles?:ResolverInputTypes["Role"],
	sort?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	type?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	visible?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["MenuQueryPageParamInput"]: {
	name?: string | undefined | null,
	permission?: string | undefined | null,
	sort: string,
	title?: string | undefined | null,
	type?: string | undefined | null,
	userId?: string | undefined | null,
	visible?: boolean | undefined | null
};
	["MenuQueryParamInput"]: {
	name?: string | undefined | null,
	title?: string | undefined | null,
	type?: ResolverInputTypes["MenuTypeEnum"] | undefined | null,
	userId?: string | undefined | null,
	visible?: boolean | undefined | null
};
	["MenuTypeEnum"]:MenuTypeEnum;
	/** Mutation root */
["Mutation"]: AliasType<{
deleteMenu?: [{	menuId?: string | undefined | null},boolean | `@${string}`],
unpublishArticle?: [{	id?: string | undefined | null},boolean | `@${string}`],
updateArticle?: [{	input?: ResolverInputTypes["UpdateArticleInputInput"] | undefined | null},ResolverInputTypes["Article"]],
updateRole?: [{	input: ResolverInputTypes["UpdateRoleInputInput"]},ResolverInputTypes["Role"]],
updateArticleCategory?: [{	input?: ResolverInputTypes["UpdateArticleCategoryInputInput"] | undefined | null},ResolverInputTypes["ArticleCategory"]],
createArticleCategory?: [{	input?: ResolverInputTypes["CreateArticleCategoryInputInput"] | undefined | null},ResolverInputTypes["ArticleCategory"]],
deleteComment?: [{	id?: string | undefined | null},boolean | `@${string}`],
createRole?: [{	input: ResolverInputTypes["CreateRoleInputInput"]},ResolverInputTypes["Role"]],
revoke?: [{	id?: string | undefined | null},boolean | `@${string}`],
updateOrg?: [{	input?: ResolverInputTypes["UpdateOrgInputInput"] | undefined | null},ResolverInputTypes["Org"]],
createComment?: [{	input?: ResolverInputTypes["CreateCommentInputInput"] | undefined | null},ResolverInputTypes["Comment"]],
updateMenu?: [{	input: ResolverInputTypes["UpdateMenuInputInput"]},ResolverInputTypes["Menu"]],
	logout?:boolean | `@${string}`,
createOrg?: [{	input?: ResolverInputTypes["CreateOrgInputInput"] | undefined | null},ResolverInputTypes["Org"]],
createMenu?: [{	input: ResolverInputTypes["CreateMenuInputInput"]},ResolverInputTypes["Menu"]],
deleteArticleCategory?: [{	id?: string | undefined | null},boolean | `@${string}`],
createArticle?: [{	input?: ResolverInputTypes["CreateArticleInputInput"] | undefined | null},ResolverInputTypes["Article"]],
deleteOrg?: [{	id?: string | undefined | null},boolean | `@${string}`],
updateRoleMenu?: [{	input: ResolverInputTypes["UpdateRoleMenuInputInput"]},boolean | `@${string}`],
publishArticle?: [{	id?: string | undefined | null},boolean | `@${string}`],
updateUser?: [{	input: ResolverInputTypes["UpdateUserInputInput"]},ResolverInputTypes["User"]],
deleteRole?: [{	roleId?: string | undefined | null},boolean | `@${string}`],
updateComment?: [{	input?: ResolverInputTypes["UpdateCommentInputInput"] | undefined | null},ResolverInputTypes["Comment"]],
deleteArticle?: [{	id?: string | undefined | null},boolean | `@${string}`],
updateUserProfile?: [{	input?: ResolverInputTypes["UpdateUserProfileInputInput"] | undefined | null},boolean | `@${string}`],
deleteUser?: [{	userId: string},boolean | `@${string}`],
registerUser?: [{	input?: ResolverInputTypes["UserRegisterInputInput"] | undefined | null},boolean | `@${string}`],
loginByAccount?: [{	input?: ResolverInputTypes["UserLoginInputInput"] | undefined | null},boolean | `@${string}`],
createUser?: [{	input: ResolverInputTypes["CreateUserInputInput"]},ResolverInputTypes["User"]],
deleteFileById?: [{	id?: string | undefined | null},boolean | `@${string}`],
		__typename?: boolean | `@${string}`
}>;
	["NullHandling"]:NullHandling;
	["Order"]: AliasType<{
	direction?:boolean | `@${string}`,
	ignoreCase?:boolean | `@${string}`,
	nullHandlingHint?:boolean | `@${string}`,
	property?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Org"]: AliasType<{
	address?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	latitude?:boolean | `@${string}`,
	lead?:ResolverInputTypes["User"],
	leadId?:boolean | `@${string}`,
	longitude?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	openTime?:boolean | `@${string}`,
	orgType?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["OrgTypeEnum"]:OrgTypeEnum;
	["Page_Article"]: AliasType<{
	content?:ResolverInputTypes["Article"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ResolverInputTypes["Pagination"],
	nextPageable?:ResolverInputTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ResolverInputTypes["Pagination"],
	previousOrFirstPageable?:ResolverInputTypes["Pagination"],
	previousPageable?:ResolverInputTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ResolverInputTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_Comment"]: AliasType<{
	content?:ResolverInputTypes["Comment"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ResolverInputTypes["Pagination"],
	nextPageable?:ResolverInputTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ResolverInputTypes["Pagination"],
	previousOrFirstPageable?:ResolverInputTypes["Pagination"],
	previousPageable?:ResolverInputTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ResolverInputTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_File"]: AliasType<{
	content?:ResolverInputTypes["File"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ResolverInputTypes["Pagination"],
	nextPageable?:ResolverInputTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ResolverInputTypes["Pagination"],
	previousOrFirstPageable?:ResolverInputTypes["Pagination"],
	previousPageable?:ResolverInputTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ResolverInputTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_Org"]: AliasType<{
	content?:ResolverInputTypes["Org"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ResolverInputTypes["Pagination"],
	nextPageable?:ResolverInputTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ResolverInputTypes["Pagination"],
	previousOrFirstPageable?:ResolverInputTypes["Pagination"],
	previousPageable?:ResolverInputTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ResolverInputTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_Role"]: AliasType<{
	content?:ResolverInputTypes["Role"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ResolverInputTypes["Pagination"],
	nextPageable?:ResolverInputTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ResolverInputTypes["Pagination"],
	previousOrFirstPageable?:ResolverInputTypes["Pagination"],
	previousPageable?:ResolverInputTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ResolverInputTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_StudyPlan"]: AliasType<{
	content?:ResolverInputTypes["StudyPlan"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ResolverInputTypes["Pagination"],
	nextPageable?:ResolverInputTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ResolverInputTypes["Pagination"],
	previousOrFirstPageable?:ResolverInputTypes["Pagination"],
	previousPageable?:ResolverInputTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ResolverInputTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_User"]: AliasType<{
	content?:ResolverInputTypes["User"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ResolverInputTypes["Pagination"],
	nextPageable?:ResolverInputTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ResolverInputTypes["Pagination"],
	previousOrFirstPageable?:ResolverInputTypes["Pagination"],
	previousPageable?:ResolverInputTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ResolverInputTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Page_WordRecord"]: AliasType<{
	content?:ResolverInputTypes["WordRecord"],
	first?:boolean | `@${string}`,
	hasContent?:boolean | `@${string}`,
	hasNext?:boolean | `@${string}`,
	hasPrevious?:boolean | `@${string}`,
	last?:boolean | `@${string}`,
	nextOrLastPageable?:ResolverInputTypes["Pagination"],
	nextPageable?:ResolverInputTypes["Pagination"],
	number?:boolean | `@${string}`,
	numberOfElements?:boolean | `@${string}`,
	pageable?:ResolverInputTypes["Pagination"],
	previousOrFirstPageable?:ResolverInputTypes["Pagination"],
	previousPageable?:ResolverInputTypes["Pagination"],
	size?:boolean | `@${string}`,
	sort?:ResolverInputTypes["Sorting"],
	totalElements?:boolean | `@${string}`,
	totalPages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Pagination"]: AliasType<{
	pageNumber?:boolean | `@${string}`,
	pageSize?:boolean | `@${string}`,
	sort?:ResolverInputTypes["Sort"],
		__typename?: boolean | `@${string}`
}>;
	/** Query root */
["Query"]: AliasType<{
	app?:boolean | `@${string}`,
	userInfo?:ResolverInputTypes["UserInfoResult"],
queryMenuList?: [{	param?: ResolverInputTypes["MenuQueryParamInput"] | undefined | null},ResolverInputTypes["Menu"]],
queryCommentPage?: [{	specification?: ResolverInputTypes["QueryCommentPageSpecificationInput"] | undefined | null},ResolverInputTypes["Page_Comment"]],
	queryArticleCategoryTree?:ResolverInputTypes["ArticleCategory"],
queryUserPage?: [{	specification: ResolverInputTypes["QueryUserPageSpecificationInput"]},ResolverInputTypes["Page_User"]],
queryStudyPlanPage?: [{	specification?: ResolverInputTypes["QueryStudyPlanPageSpecificationInput"] | undefined | null},ResolverInputTypes["Page_StudyPlan"]],
queryArticle?: [{	id?: string | undefined | null},ResolverInputTypes["Article"]],
queryMenuTree?: [{	param?: ResolverInputTypes["MenuQueryPageParamInput"] | undefined | null},ResolverInputTypes["Menu"]],
queryRolePage?: [{	param?: ResolverInputTypes["RoleQueryParamInput"] | undefined | null},ResolverInputTypes["Page_Role"]],
	queryLoginSessionList?:ResolverInputTypes["LoginSessionResult"],
queryRole?: [{	roleId?: string | undefined | null},ResolverInputTypes["Role"]],
queryUserList?: [{	specification?: ResolverInputTypes["QueryUserSpecificationInput"] | undefined | null},ResolverInputTypes["User"]],
	queryAllRoleList?:ResolverInputTypes["Role"],
	queryDefaultRole?:boolean | `@${string}`,
queryArticlePage?: [{	specification?: ResolverInputTypes["QueryArticlePageSpecificationInput"] | undefined | null},ResolverInputTypes["Page_Article"]],
queryWordRecordPage?: [{	specification?: ResolverInputTypes["QueryWordRecordPageSpecificationInput"] | undefined | null},ResolverInputTypes["Page_WordRecord"]],
queryOrgPage?: [{	specification?: ResolverInputTypes["QueryOrgPageSpecificationInput"] | undefined | null},ResolverInputTypes["Page_Org"]],
queryFilePage?: [{	param?: ResolverInputTypes["FileQueryPageParamInput"] | undefined | null},ResolverInputTypes["Page_File"]],
queryUser?: [{	userId?: string | undefined | null},ResolverInputTypes["User"]],
queryArticleCategory?: [{	specification?: ResolverInputTypes["QueryArticleCategorySpecificationInput"] | undefined | null},ResolverInputTypes["ArticleCategory"]],
setDayPlanAndName?: [{	input?: ResolverInputTypes["SetPlanAndNickNameInputInput"] | undefined | null},boolean | `@${string}`],
		__typename?: boolean | `@${string}`
}>;
	["QueryArticleCategorySpecificationInput"]: {
	name?: string | undefined | null,
	parentId?: string | undefined | null
};
	["QueryArticlePageSpecificationInput"]: {
	markdown?: string | undefined | null,
	pageNo: number,
	pageSize: number,
	sort?: string | undefined | null,
	title?: string | undefined | null
};
	["QueryCommentPageSpecificationInput"]: {
	orgId?: string | undefined | null,
	orgName?: string | undefined | null,
	pageNo: number,
	pageSize: number,
	sort?: string | undefined | null,
	type?: string | undefined | null,
	userId?: string | undefined | null,
	userName?: string | undefined | null
};
	["QueryOrgPageSpecificationInput"]: {
	address?: string | undefined | null,
	lat?: number | undefined | null,
	lng?: number | undefined | null,
	name?: string | undefined | null,
	orgType?: ResolverInputTypes["OrgTypeEnum"] | undefined | null,
	pageNo: number,
	pageSize: number,
	sort?: string | undefined | null
};
	["QueryStudyPlanPageSpecificationInput"]: {
	pageNo: number,
	pageSize: number,
	sort?: string | undefined | null
};
	["QueryUserPageSpecificationInput"]: {
	email?: string | undefined | null,
	nickName?: string | undefined | null,
	orgId?: string | undefined | null,
	pageNo: number,
	pageSize: number,
	phone?: string | undefined | null,
	roleIds?: Array<string | undefined | null> | undefined | null,
	roleKey?: string | undefined | null,
	sort?: string | undefined | null,
	userName?: string | undefined | null
};
	["QueryUserSpecificationInput"]: {
	key?: string | undefined | null,
	nickName?: string | undefined | null,
	userName?: string | undefined | null
};
	["QueryWordRecordPageSpecificationInput"]: {
	pageNo: number,
	pageSize: number,
	sort?: string | undefined | null,
	type?: string | undefined | null
};
	["Role"]: AliasType<{
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	default?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	key?:boolean | `@${string}`,
	level?:boolean | `@${string}`,
	menuIds?:boolean | `@${string}`,
	menus?:ResolverInputTypes["Menu"],
	name?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	users?:ResolverInputTypes["User"],
		__typename?: boolean | `@${string}`
}>;
	["RoleQueryParamInput"]: {
	createdAtFrom?: string | undefined | null,
	createdAtTo?: string | undefined | null,
	key?: string | undefined | null,
	name?: string | undefined | null,
	pageNo?: number | undefined | null,
	pageSize?: number | undefined | null,
	sort?: string | undefined | null
};
	["SetPlanAndNickNameInputInput"]: {
	dayCount?: number | undefined | null,
	nickName?: string | undefined | null
};
	["Sort"]: AliasType<{
	orders?:ResolverInputTypes["Order"],
		__typename?: boolean | `@${string}`
}>;
	["Sorting"]: AliasType<{
	orders?:ResolverInputTypes["Order"],
		__typename?: boolean | `@${string}`
}>;
	["StudyPlan"]: AliasType<{
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	date?:boolean | `@${string}`,
	dayCount?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	planCount?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	user?:ResolverInputTypes["User"],
	userId?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UpdateArticleCategoryInputInput"]: {
	icon?: string | undefined | null,
	/** id */
	id?: string | undefined | null,
	name?: string | undefined | null,
	parentId?: string | undefined | null,
	sort?: number | undefined | null
};
	["UpdateArticleInputInput"]: {
	html?: string | undefined | null,
	/** id */
	id?: string | undefined | null,
	image?: string | undefined | null,
	markdown?: string | undefined | null,
	metaDescription?: string | undefined | null,
	metaTitle?: string | undefined | null,
	title?: string | undefined | null
};
	["UpdateCommentInputInput"]: {
	content?: string | undefined | null,
	/** id */
	id?: string | undefined | null
};
	["UpdateMenuInputInput"]: {
	component?: string | undefined | null,
	frame?: boolean | undefined | null,
	icon?: string | undefined | null,
	/** id */
	id?: string | undefined | null,
	name?: string | undefined | null,
	parentId?: string | undefined | null,
	path?: string | undefined | null,
	permission?: string | undefined | null,
	sort?: number | undefined | null,
	title?: string | undefined | null,
	type?: ResolverInputTypes["MenuTypeEnum"] | undefined | null,
	visible?: boolean | undefined | null
};
	["UpdateOrgInputInput"]: {
	address?: string | undefined | null,
	/** id */
	id?: string | undefined | null,
	latitude: number,
	leadId?: string | undefined | null,
	longitude: number,
	name?: string | undefined | null,
	openTime?: string | undefined | null,
	orgType?: ResolverInputTypes["OrgTypeEnum"] | undefined | null
};
	["UpdateRoleInputInput"]: {
	/** id */
	id?: string | undefined | null,
	key?: string | undefined | null,
	level?: number | undefined | null,
	name?: string | undefined | null
};
	["UpdateRoleMenuInputInput"]: {
	/** id */
	id?: string | undefined | null,
	menuIds?: Array<string | undefined | null> | undefined | null
};
	["UpdateUserInputInput"]: {
	avatar?: string | undefined | null,
	email?: string | undefined | null,
	gender?: ResolverInputTypes["GenderEnum"] | undefined | null,
	/** id */
	id?: string | undefined | null,
	job?: string | undefined | null,
	nickName?: string | undefined | null,
	note?: string | undefined | null,
	orgId?: string | undefined | null,
	phone?: string | undefined | null,
	roleIds?: Array<string | undefined | null> | undefined | null,
	userName?: string | undefined | null
};
	["UpdateUserProfileInputInput"]: {
	avatar?: string | undefined | null,
	nickName?: string | undefined | null,
	oldPassword?: string | undefined | null,
	password?: string | undefined | null
};
	["User"]: AliasType<{
	avatar?:boolean | `@${string}`,
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	dayCount?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	gender?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	job?:boolean | `@${string}`,
	nickName?:boolean | `@${string}`,
	note?:boolean | `@${string}`,
	org?:ResolverInputTypes["Org"],
	orgId?:boolean | `@${string}`,
	phone?:boolean | `@${string}`,
	roles?:ResolverInputTypes["Role"],
	totalCount?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	userName?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserInfoResult"]: AliasType<{
	avatar?:boolean | `@${string}`,
	dayCount?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	gender?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
	menus?:ResolverInputTypes["Menu"],
	nickName?:boolean | `@${string}`,
	passwordEnable?:boolean | `@${string}`,
	permissions?:boolean | `@${string}`,
	phone?:boolean | `@${string}`,
	roles?:ResolverInputTypes["Role"],
	superAdmin?:boolean | `@${string}`,
	totalCount?:boolean | `@${string}`,
	userName?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserLoginInputInput"]: {
	/** 用户名 */
	account?: string | undefined | null,
	/** 密码 */
	password?: string | undefined | null
};
	["UserRegisterInputInput"]: {
	account?: string | undefined | null,
	email?: string | undefined | null,
	nickName?: string | undefined | null,
	password?: string | undefined | null,
	phone?: string | undefined | null
};
	["WordRecord"]: AliasType<{
	/** 创建时间 */
	createdAt?:boolean | `@${string}`,
	/** 创建人 */
	createdBy?:boolean | `@${string}`,
	detail?:boolean | `@${string}`,
	/** id */
	id?:boolean | `@${string}`,
	image?:boolean | `@${string}`,
	type?:boolean | `@${string}`,
	/** 更新时间 */
	updatedAt?:boolean | `@${string}`,
	/** 更新人 */
	updatedBy?:boolean | `@${string}`,
	user?:ResolverInputTypes["User"],
	userId?:boolean | `@${string}`,
	word?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["schema"]: AliasType<{
	query?:ResolverInputTypes["Query"],
	mutation?:ResolverInputTypes["Mutation"],
		__typename?: boolean | `@${string}`
}>
  }

export type ModelTypes = {
    ["Article"]: {
		author?: ModelTypes["User"] | undefined,
	authorId?: string | undefined,
	category?: ModelTypes["ArticleCategory"] | undefined,
	categoryId?: string | undefined,
	/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	html?: string | undefined,
	/** id */
	id?: string | undefined,
	image?: string | undefined,
	markdown?: string | undefined,
	metaDescription?: string | undefined,
	metaTitle?: string | undefined,
	publishedAt?: ModelTypes["LocalDateTime"] | undefined,
	publishedBy?: string | undefined,
	status?: ModelTypes["ArticleStatusEnum"] | undefined,
	title?: string | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined
};
	["ArticleCategory"]: {
		articles?: Array<ModelTypes["Article"] | undefined> | undefined,
	children?: Array<ModelTypes["ArticleCategory"] | undefined> | undefined,
	/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	icon?: string | undefined,
	/** id */
	id?: string | undefined,
	name?: string | undefined,
	parent?: ModelTypes["ArticleCategory"] | undefined,
	parentId?: string | undefined,
	sort?: number | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined
};
	["ArticleStatusEnum"]:ArticleStatusEnum;
	["BaseEntity"]: ModelTypes["Article"] | ModelTypes["ArticleCategory"] | ModelTypes["Comment"] | ModelTypes["File"] | ModelTypes["Menu"] | ModelTypes["Org"] | ModelTypes["Role"] | ModelTypes["StudyPlan"] | ModelTypes["User"] | ModelTypes["WordRecord"];
	["Comment"]: {
		content?: string | undefined,
	/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	/** id */
	id?: string | undefined,
	ip?: string | undefined,
	location?: string | undefined,
	org?: ModelTypes["Org"] | undefined,
	orgId?: string | undefined,
	type?: string | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	user?: ModelTypes["User"] | undefined,
	userId?: string | undefined
};
	["CreateArticleCategoryInputInput"]: {
	icon?: string | undefined,
	name?: string | undefined,
	parentId?: string | undefined,
	sort?: number | undefined
};
	["CreateArticleInputInput"]: {
	html?: string | undefined,
	image?: string | undefined,
	markdown?: string | undefined,
	metaDescription?: string | undefined,
	metaTitle?: string | undefined,
	title?: string | undefined
};
	["CreateCommentInputInput"]: {
	content?: string | undefined,
	orgId?: string | undefined,
	type?: string | undefined
};
	["CreateMenuInputInput"]: {
	component?: string | undefined,
	frame?: boolean | undefined,
	icon?: string | undefined,
	name?: string | undefined,
	parentId?: string | undefined,
	path?: string | undefined,
	permission?: string | undefined,
	sort?: number | undefined,
	title?: string | undefined,
	type?: ModelTypes["MenuTypeEnum"] | undefined,
	visible?: boolean | undefined
};
	["CreateOrgInputInput"]: {
	address?: string | undefined,
	latitude: number,
	leadId?: string | undefined,
	longitude: number,
	name?: string | undefined,
	openTime?: string | undefined,
	orgType?: ModelTypes["OrgTypeEnum"] | undefined
};
	["CreateRoleInputInput"]: {
	key?: string | undefined,
	level?: number | undefined,
	name?: string | undefined
};
	["CreateUserInputInput"]: {
	avatar?: string | undefined,
	email?: string | undefined,
	gender?: ModelTypes["GenderEnum"] | undefined,
	job?: string | undefined,
	nickName?: string | undefined,
	note?: string | undefined,
	orgId?: string | undefined,
	password?: string | undefined,
	phone?: string | undefined,
	roleIds?: Array<string | undefined> | undefined,
	userName?: string | undefined
};
	["DefaultRoleEnum"]:DefaultRoleEnum;
	["Direction"]:Direction;
	["File"]: {
		bucket?: string | undefined,
	category?: string | undefined,
	/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	fileHash?: string | undefined,
	fileName?: string | undefined,
	fileSize?: number | undefined,
	/** id */
	id?: string | undefined,
	mimeType?: string | undefined,
	originName?: string | undefined,
	provider?: ModelTypes["FileProviderEnum"] | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	url?: string | undefined
};
	["FileProviderEnum"]:FileProviderEnum;
	["FileQueryPageParamInput"]: {
	createdAtFrom?: string | undefined,
	createdAtTo?: string | undefined,
	fileName?: string | undefined,
	originName?: string | undefined,
	pageNo?: number | undefined,
	pageSize?: number | undefined,
	provider?: ModelTypes["FileProviderEnum"] | undefined,
	sort?: string | undefined
};
	["GenderEnum"]:GenderEnum;
	/** Built-in scalar representing a local date */
["LocalDate"]:any;
	/** Built-in scalar representing a local date-time */
["LocalDateTime"]:any;
	["LoginSessionResult"]: {
		createdAt?: ModelTypes["LocalDateTime"] | undefined,
	current?: boolean | undefined,
	expired?: boolean | undefined,
	id?: string | undefined,
	ip?: string | undefined
};
	/** A 64-bit signed integer */
["Long"]:any;
	["Menu"]: {
		children?: Array<ModelTypes["Menu"] | undefined> | undefined,
	component?: string | undefined,
	/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	frame?: boolean | undefined,
	icon?: string | undefined,
	/** id */
	id?: string | undefined,
	name?: string | undefined,
	parent?: ModelTypes["Menu"] | undefined,
	parentId?: string | undefined,
	path?: string | undefined,
	permission?: string | undefined,
	roles?: Array<ModelTypes["Role"] | undefined> | undefined,
	sort?: number | undefined,
	title?: string | undefined,
	type?: ModelTypes["MenuTypeEnum"] | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	visible?: boolean | undefined
};
	["MenuQueryPageParamInput"]: {
	name?: string | undefined,
	permission?: string | undefined,
	sort: string,
	title?: string | undefined,
	type?: string | undefined,
	userId?: string | undefined,
	visible?: boolean | undefined
};
	["MenuQueryParamInput"]: {
	name?: string | undefined,
	title?: string | undefined,
	type?: ModelTypes["MenuTypeEnum"] | undefined,
	userId?: string | undefined,
	visible?: boolean | undefined
};
	["MenuTypeEnum"]:MenuTypeEnum;
	/** Mutation root */
["Mutation"]: {
		deleteMenu: boolean,
	unpublishArticle?: boolean | undefined,
	updateArticle?: ModelTypes["Article"] | undefined,
	updateRole?: ModelTypes["Role"] | undefined,
	updateArticleCategory?: ModelTypes["ArticleCategory"] | undefined,
	createArticleCategory?: ModelTypes["ArticleCategory"] | undefined,
	deleteComment?: boolean | undefined,
	createRole?: ModelTypes["Role"] | undefined,
	revoke: boolean,
	updateOrg?: ModelTypes["Org"] | undefined,
	createComment?: ModelTypes["Comment"] | undefined,
	updateMenu?: ModelTypes["Menu"] | undefined,
	logout: boolean,
	createOrg?: ModelTypes["Org"] | undefined,
	createMenu?: ModelTypes["Menu"] | undefined,
	deleteArticleCategory?: boolean | undefined,
	createArticle?: ModelTypes["Article"] | undefined,
	deleteOrg?: boolean | undefined,
	updateRoleMenu?: boolean | undefined,
	publishArticle?: boolean | undefined,
	updateUser?: ModelTypes["User"] | undefined,
	deleteRole: boolean,
	updateComment?: ModelTypes["Comment"] | undefined,
	deleteArticle?: boolean | undefined,
	updateUserProfile?: boolean | undefined,
	deleteUser: boolean,
	registerUser?: boolean | undefined,
	loginByAccount?: string | undefined,
	createUser?: ModelTypes["User"] | undefined,
	deleteFileById: boolean
};
	["NullHandling"]:NullHandling;
	["Order"]: {
		direction?: ModelTypes["Direction"] | undefined,
	ignoreCase?: boolean | undefined,
	nullHandlingHint?: ModelTypes["NullHandling"] | undefined,
	property: string
};
	["Org"]: {
		address?: string | undefined,
	/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	/** id */
	id?: string | undefined,
	latitude: number,
	lead?: ModelTypes["User"] | undefined,
	leadId?: string | undefined,
	longitude: number,
	name?: string | undefined,
	openTime?: string | undefined,
	orgType?: ModelTypes["OrgTypeEnum"] | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined
};
	["OrgTypeEnum"]:OrgTypeEnum;
	["Page_Article"]: {
		content?: Array<ModelTypes["Article"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: ModelTypes["Pagination"] | undefined,
	nextPageable?: ModelTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: ModelTypes["Pagination"] | undefined,
	previousOrFirstPageable?: ModelTypes["Pagination"] | undefined,
	previousPageable?: ModelTypes["Pagination"] | undefined,
	size: number,
	sort?: ModelTypes["Sorting"] | undefined,
	totalElements: ModelTypes["Long"],
	totalPages: number
};
	["Page_Comment"]: {
		content?: Array<ModelTypes["Comment"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: ModelTypes["Pagination"] | undefined,
	nextPageable?: ModelTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: ModelTypes["Pagination"] | undefined,
	previousOrFirstPageable?: ModelTypes["Pagination"] | undefined,
	previousPageable?: ModelTypes["Pagination"] | undefined,
	size: number,
	sort?: ModelTypes["Sorting"] | undefined,
	totalElements: ModelTypes["Long"],
	totalPages: number
};
	["Page_File"]: {
		content?: Array<ModelTypes["File"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: ModelTypes["Pagination"] | undefined,
	nextPageable?: ModelTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: ModelTypes["Pagination"] | undefined,
	previousOrFirstPageable?: ModelTypes["Pagination"] | undefined,
	previousPageable?: ModelTypes["Pagination"] | undefined,
	size: number,
	sort?: ModelTypes["Sorting"] | undefined,
	totalElements: ModelTypes["Long"],
	totalPages: number
};
	["Page_Org"]: {
		content?: Array<ModelTypes["Org"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: ModelTypes["Pagination"] | undefined,
	nextPageable?: ModelTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: ModelTypes["Pagination"] | undefined,
	previousOrFirstPageable?: ModelTypes["Pagination"] | undefined,
	previousPageable?: ModelTypes["Pagination"] | undefined,
	size: number,
	sort?: ModelTypes["Sorting"] | undefined,
	totalElements: ModelTypes["Long"],
	totalPages: number
};
	["Page_Role"]: {
		content?: Array<ModelTypes["Role"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: ModelTypes["Pagination"] | undefined,
	nextPageable?: ModelTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: ModelTypes["Pagination"] | undefined,
	previousOrFirstPageable?: ModelTypes["Pagination"] | undefined,
	previousPageable?: ModelTypes["Pagination"] | undefined,
	size: number,
	sort?: ModelTypes["Sorting"] | undefined,
	totalElements: ModelTypes["Long"],
	totalPages: number
};
	["Page_StudyPlan"]: {
		content?: Array<ModelTypes["StudyPlan"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: ModelTypes["Pagination"] | undefined,
	nextPageable?: ModelTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: ModelTypes["Pagination"] | undefined,
	previousOrFirstPageable?: ModelTypes["Pagination"] | undefined,
	previousPageable?: ModelTypes["Pagination"] | undefined,
	size: number,
	sort?: ModelTypes["Sorting"] | undefined,
	totalElements: ModelTypes["Long"],
	totalPages: number
};
	["Page_User"]: {
		content?: Array<ModelTypes["User"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: ModelTypes["Pagination"] | undefined,
	nextPageable?: ModelTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: ModelTypes["Pagination"] | undefined,
	previousOrFirstPageable?: ModelTypes["Pagination"] | undefined,
	previousPageable?: ModelTypes["Pagination"] | undefined,
	size: number,
	sort?: ModelTypes["Sorting"] | undefined,
	totalElements: ModelTypes["Long"],
	totalPages: number
};
	["Page_WordRecord"]: {
		content?: Array<ModelTypes["WordRecord"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: ModelTypes["Pagination"] | undefined,
	nextPageable?: ModelTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: ModelTypes["Pagination"] | undefined,
	previousOrFirstPageable?: ModelTypes["Pagination"] | undefined,
	previousPageable?: ModelTypes["Pagination"] | undefined,
	size: number,
	sort?: ModelTypes["Sorting"] | undefined,
	totalElements: ModelTypes["Long"],
	totalPages: number
};
	["Pagination"]: {
		pageNumber: number,
	pageSize?: number | undefined,
	sort?: ModelTypes["Sort"] | undefined
};
	/** Query root */
["Query"]: {
		app?: string | undefined,
	userInfo?: ModelTypes["UserInfoResult"] | undefined,
	queryMenuList?: Array<ModelTypes["Menu"] | undefined> | undefined,
	queryCommentPage?: ModelTypes["Page_Comment"] | undefined,
	queryArticleCategoryTree?: Array<ModelTypes["ArticleCategory"] | undefined> | undefined,
	queryUserPage?: ModelTypes["Page_User"] | undefined,
	queryStudyPlanPage?: ModelTypes["Page_StudyPlan"] | undefined,
	queryArticle?: ModelTypes["Article"] | undefined,
	queryMenuTree?: Array<ModelTypes["Menu"] | undefined> | undefined,
	queryRolePage?: ModelTypes["Page_Role"] | undefined,
	queryLoginSessionList?: Array<ModelTypes["LoginSessionResult"] | undefined> | undefined,
	queryRole?: ModelTypes["Role"] | undefined,
	queryUserList?: Array<ModelTypes["User"] | undefined> | undefined,
	queryAllRoleList?: Array<ModelTypes["Role"] | undefined> | undefined,
	queryDefaultRole?: Array<ModelTypes["DefaultRoleEnum"] | undefined> | undefined,
	queryArticlePage?: ModelTypes["Page_Article"] | undefined,
	queryWordRecordPage?: ModelTypes["Page_WordRecord"] | undefined,
	queryOrgPage?: ModelTypes["Page_Org"] | undefined,
	queryFilePage?: ModelTypes["Page_File"] | undefined,
	queryUser?: ModelTypes["User"] | undefined,
	queryArticleCategory?: Array<ModelTypes["ArticleCategory"] | undefined> | undefined,
	setDayPlanAndName?: boolean | undefined
};
	["QueryArticleCategorySpecificationInput"]: {
	name?: string | undefined,
	parentId?: string | undefined
};
	["QueryArticlePageSpecificationInput"]: {
	markdown?: string | undefined,
	pageNo: number,
	pageSize: number,
	sort?: string | undefined,
	title?: string | undefined
};
	["QueryCommentPageSpecificationInput"]: {
	orgId?: string | undefined,
	orgName?: string | undefined,
	pageNo: number,
	pageSize: number,
	sort?: string | undefined,
	type?: string | undefined,
	userId?: string | undefined,
	userName?: string | undefined
};
	["QueryOrgPageSpecificationInput"]: {
	address?: string | undefined,
	lat?: number | undefined,
	lng?: number | undefined,
	name?: string | undefined,
	orgType?: ModelTypes["OrgTypeEnum"] | undefined,
	pageNo: number,
	pageSize: number,
	sort?: string | undefined
};
	["QueryStudyPlanPageSpecificationInput"]: {
	pageNo: number,
	pageSize: number,
	sort?: string | undefined
};
	["QueryUserPageSpecificationInput"]: {
	email?: string | undefined,
	nickName?: string | undefined,
	orgId?: string | undefined,
	pageNo: number,
	pageSize: number,
	phone?: string | undefined,
	roleIds?: Array<string | undefined> | undefined,
	roleKey?: string | undefined,
	sort?: string | undefined,
	userName?: string | undefined
};
	["QueryUserSpecificationInput"]: {
	key?: string | undefined,
	nickName?: string | undefined,
	userName?: string | undefined
};
	["QueryWordRecordPageSpecificationInput"]: {
	pageNo: number,
	pageSize: number,
	sort?: string | undefined,
	type?: string | undefined
};
	["Role"]: {
		/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	default?: number | undefined,
	/** id */
	id?: string | undefined,
	key?: string | undefined,
	level?: number | undefined,
	menuIds?: Array<string | undefined> | undefined,
	menus?: Array<ModelTypes["Menu"] | undefined> | undefined,
	name?: string | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	users?: Array<ModelTypes["User"] | undefined> | undefined
};
	["RoleQueryParamInput"]: {
	createdAtFrom?: string | undefined,
	createdAtTo?: string | undefined,
	key?: string | undefined,
	name?: string | undefined,
	pageNo?: number | undefined,
	pageSize?: number | undefined,
	sort?: string | undefined
};
	["SetPlanAndNickNameInputInput"]: {
	dayCount?: number | undefined,
	nickName?: string | undefined
};
	["Sort"]: {
		orders: Array<ModelTypes["Order"]>
};
	["Sorting"]: {
		orders: Array<ModelTypes["Order"]>
};
	["StudyPlan"]: {
		/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	date?: ModelTypes["LocalDate"] | undefined,
	dayCount?: number | undefined,
	/** id */
	id?: string | undefined,
	planCount?: number | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	user?: ModelTypes["User"] | undefined,
	userId?: string | undefined
};
	["UpdateArticleCategoryInputInput"]: {
	icon?: string | undefined,
	/** id */
	id?: string | undefined,
	name?: string | undefined,
	parentId?: string | undefined,
	sort?: number | undefined
};
	["UpdateArticleInputInput"]: {
	html?: string | undefined,
	/** id */
	id?: string | undefined,
	image?: string | undefined,
	markdown?: string | undefined,
	metaDescription?: string | undefined,
	metaTitle?: string | undefined,
	title?: string | undefined
};
	["UpdateCommentInputInput"]: {
	content?: string | undefined,
	/** id */
	id?: string | undefined
};
	["UpdateMenuInputInput"]: {
	component?: string | undefined,
	frame?: boolean | undefined,
	icon?: string | undefined,
	/** id */
	id?: string | undefined,
	name?: string | undefined,
	parentId?: string | undefined,
	path?: string | undefined,
	permission?: string | undefined,
	sort?: number | undefined,
	title?: string | undefined,
	type?: ModelTypes["MenuTypeEnum"] | undefined,
	visible?: boolean | undefined
};
	["UpdateOrgInputInput"]: {
	address?: string | undefined,
	/** id */
	id?: string | undefined,
	latitude: number,
	leadId?: string | undefined,
	longitude: number,
	name?: string | undefined,
	openTime?: string | undefined,
	orgType?: ModelTypes["OrgTypeEnum"] | undefined
};
	["UpdateRoleInputInput"]: {
	/** id */
	id?: string | undefined,
	key?: string | undefined,
	level?: number | undefined,
	name?: string | undefined
};
	["UpdateRoleMenuInputInput"]: {
	/** id */
	id?: string | undefined,
	menuIds?: Array<string | undefined> | undefined
};
	["UpdateUserInputInput"]: {
	avatar?: string | undefined,
	email?: string | undefined,
	gender?: ModelTypes["GenderEnum"] | undefined,
	/** id */
	id?: string | undefined,
	job?: string | undefined,
	nickName?: string | undefined,
	note?: string | undefined,
	orgId?: string | undefined,
	phone?: string | undefined,
	roleIds?: Array<string | undefined> | undefined,
	userName?: string | undefined
};
	["UpdateUserProfileInputInput"]: {
	avatar?: string | undefined,
	nickName?: string | undefined,
	oldPassword?: string | undefined,
	password?: string | undefined
};
	["User"]: {
		avatar?: string | undefined,
	/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	dayCount?: number | undefined,
	email?: string | undefined,
	gender?: ModelTypes["GenderEnum"] | undefined,
	/** id */
	id?: string | undefined,
	job?: string | undefined,
	nickName?: string | undefined,
	note?: string | undefined,
	org?: ModelTypes["Org"] | undefined,
	orgId?: string | undefined,
	phone?: string | undefined,
	roles?: Array<ModelTypes["Role"] | undefined> | undefined,
	totalCount?: number | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	userName?: string | undefined
};
	["UserInfoResult"]: {
		avatar?: string | undefined,
	dayCount?: number | undefined,
	email?: string | undefined,
	gender?: ModelTypes["GenderEnum"] | undefined,
	id?: string | undefined,
	menus?: Array<ModelTypes["Menu"] | undefined> | undefined,
	nickName?: string | undefined,
	passwordEnable: boolean,
	permissions?: Array<string | undefined> | undefined,
	phone?: string | undefined,
	roles?: Array<ModelTypes["Role"] | undefined> | undefined,
	superAdmin: boolean,
	totalCount?: number | undefined,
	userName?: string | undefined
};
	["UserLoginInputInput"]: {
	/** 用户名 */
	account?: string | undefined,
	/** 密码 */
	password?: string | undefined
};
	["UserRegisterInputInput"]: {
	account?: string | undefined,
	email?: string | undefined,
	nickName?: string | undefined,
	password?: string | undefined,
	phone?: string | undefined
};
	["WordRecord"]: {
		/** 创建时间 */
	createdAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	detail?: string | undefined,
	/** id */
	id?: string | undefined,
	image?: string | undefined,
	type?: string | undefined,
	/** 更新时间 */
	updatedAt?: ModelTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	user?: ModelTypes["User"] | undefined,
	userId?: string | undefined,
	word?: string | undefined
};
	["schema"]: {
	query?: ModelTypes["Query"] | undefined,
	mutation?: ModelTypes["Mutation"] | undefined
}
    }

export type GraphQLTypes = {
    ["Article"]: {
	__typename: "Article",
	author?: GraphQLTypes["User"] | undefined,
	authorId?: string | undefined,
	category?: GraphQLTypes["ArticleCategory"] | undefined,
	categoryId?: string | undefined,
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	html?: string | undefined,
	/** id */
	id?: string | undefined,
	image?: string | undefined,
	markdown?: string | undefined,
	metaDescription?: string | undefined,
	metaTitle?: string | undefined,
	publishedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	publishedBy?: string | undefined,
	status?: GraphQLTypes["ArticleStatusEnum"] | undefined,
	title?: string | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined
};
	["ArticleCategory"]: {
	__typename: "ArticleCategory",
	articles?: Array<GraphQLTypes["Article"] | undefined> | undefined,
	children?: Array<GraphQLTypes["ArticleCategory"] | undefined> | undefined,
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	icon?: string | undefined,
	/** id */
	id?: string | undefined,
	name?: string | undefined,
	parent?: GraphQLTypes["ArticleCategory"] | undefined,
	parentId?: string | undefined,
	sort?: number | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined
};
	["ArticleStatusEnum"]: ArticleStatusEnum;
	["BaseEntity"]: {
	__typename:"Article" | "ArticleCategory" | "Comment" | "File" | "Menu" | "Org" | "Role" | "StudyPlan" | "User" | "WordRecord",
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	/** id */
	id?: string | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined
	['...on Article']: '__union' & GraphQLTypes["Article"];
	['...on ArticleCategory']: '__union' & GraphQLTypes["ArticleCategory"];
	['...on Comment']: '__union' & GraphQLTypes["Comment"];
	['...on File']: '__union' & GraphQLTypes["File"];
	['...on Menu']: '__union' & GraphQLTypes["Menu"];
	['...on Org']: '__union' & GraphQLTypes["Org"];
	['...on Role']: '__union' & GraphQLTypes["Role"];
	['...on StudyPlan']: '__union' & GraphQLTypes["StudyPlan"];
	['...on User']: '__union' & GraphQLTypes["User"];
	['...on WordRecord']: '__union' & GraphQLTypes["WordRecord"];
};
	["Comment"]: {
	__typename: "Comment",
	content?: string | undefined,
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	/** id */
	id?: string | undefined,
	ip?: string | undefined,
	location?: string | undefined,
	org?: GraphQLTypes["Org"] | undefined,
	orgId?: string | undefined,
	type?: string | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	user?: GraphQLTypes["User"] | undefined,
	userId?: string | undefined
};
	["CreateArticleCategoryInputInput"]: {
		icon?: string | undefined,
	name?: string | undefined,
	parentId?: string | undefined,
	sort?: number | undefined
};
	["CreateArticleInputInput"]: {
		html?: string | undefined,
	image?: string | undefined,
	markdown?: string | undefined,
	metaDescription?: string | undefined,
	metaTitle?: string | undefined,
	title?: string | undefined
};
	["CreateCommentInputInput"]: {
		content?: string | undefined,
	orgId?: string | undefined,
	type?: string | undefined
};
	["CreateMenuInputInput"]: {
		component?: string | undefined,
	frame?: boolean | undefined,
	icon?: string | undefined,
	name?: string | undefined,
	parentId?: string | undefined,
	path?: string | undefined,
	permission?: string | undefined,
	sort?: number | undefined,
	title?: string | undefined,
	type?: GraphQLTypes["MenuTypeEnum"] | undefined,
	visible?: boolean | undefined
};
	["CreateOrgInputInput"]: {
		address?: string | undefined,
	latitude: number,
	leadId?: string | undefined,
	longitude: number,
	name?: string | undefined,
	openTime?: string | undefined,
	orgType?: GraphQLTypes["OrgTypeEnum"] | undefined
};
	["CreateRoleInputInput"]: {
		key?: string | undefined,
	level?: number | undefined,
	name?: string | undefined
};
	["CreateUserInputInput"]: {
		avatar?: string | undefined,
	email?: string | undefined,
	gender?: GraphQLTypes["GenderEnum"] | undefined,
	job?: string | undefined,
	nickName?: string | undefined,
	note?: string | undefined,
	orgId?: string | undefined,
	password?: string | undefined,
	phone?: string | undefined,
	roleIds?: Array<string | undefined> | undefined,
	userName?: string | undefined
};
	["DefaultRoleEnum"]: DefaultRoleEnum;
	["Direction"]: Direction;
	["File"]: {
	__typename: "File",
	bucket?: string | undefined,
	category?: string | undefined,
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	fileHash?: string | undefined,
	fileName?: string | undefined,
	fileSize?: number | undefined,
	/** id */
	id?: string | undefined,
	mimeType?: string | undefined,
	originName?: string | undefined,
	provider?: GraphQLTypes["FileProviderEnum"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	url?: string | undefined
};
	["FileProviderEnum"]: FileProviderEnum;
	["FileQueryPageParamInput"]: {
		createdAtFrom?: string | undefined,
	createdAtTo?: string | undefined,
	fileName?: string | undefined,
	originName?: string | undefined,
	pageNo?: number | undefined,
	pageSize?: number | undefined,
	provider?: GraphQLTypes["FileProviderEnum"] | undefined,
	sort?: string | undefined
};
	["GenderEnum"]: GenderEnum;
	/** Built-in scalar representing a local date */
["LocalDate"]: "scalar" & { name: "LocalDate" };
	/** Built-in scalar representing a local date-time */
["LocalDateTime"]: "scalar" & { name: "LocalDateTime" };
	["LoginSessionResult"]: {
	__typename: "LoginSessionResult",
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	current?: boolean | undefined,
	expired?: boolean | undefined,
	id?: string | undefined,
	ip?: string | undefined
};
	/** A 64-bit signed integer */
["Long"]: "scalar" & { name: "Long" };
	["Menu"]: {
	__typename: "Menu",
	children?: Array<GraphQLTypes["Menu"] | undefined> | undefined,
	component?: string | undefined,
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	frame?: boolean | undefined,
	icon?: string | undefined,
	/** id */
	id?: string | undefined,
	name?: string | undefined,
	parent?: GraphQLTypes["Menu"] | undefined,
	parentId?: string | undefined,
	path?: string | undefined,
	permission?: string | undefined,
	roles?: Array<GraphQLTypes["Role"] | undefined> | undefined,
	sort?: number | undefined,
	title?: string | undefined,
	type?: GraphQLTypes["MenuTypeEnum"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	visible?: boolean | undefined
};
	["MenuQueryPageParamInput"]: {
		name?: string | undefined,
	permission?: string | undefined,
	sort: string,
	title?: string | undefined,
	type?: string | undefined,
	userId?: string | undefined,
	visible?: boolean | undefined
};
	["MenuQueryParamInput"]: {
		name?: string | undefined,
	title?: string | undefined,
	type?: GraphQLTypes["MenuTypeEnum"] | undefined,
	userId?: string | undefined,
	visible?: boolean | undefined
};
	["MenuTypeEnum"]: MenuTypeEnum;
	/** Mutation root */
["Mutation"]: {
	__typename: "Mutation",
	deleteMenu: boolean,
	unpublishArticle?: boolean | undefined,
	updateArticle?: GraphQLTypes["Article"] | undefined,
	updateRole?: GraphQLTypes["Role"] | undefined,
	updateArticleCategory?: GraphQLTypes["ArticleCategory"] | undefined,
	createArticleCategory?: GraphQLTypes["ArticleCategory"] | undefined,
	deleteComment?: boolean | undefined,
	createRole?: GraphQLTypes["Role"] | undefined,
	revoke: boolean,
	updateOrg?: GraphQLTypes["Org"] | undefined,
	createComment?: GraphQLTypes["Comment"] | undefined,
	updateMenu?: GraphQLTypes["Menu"] | undefined,
	logout: boolean,
	createOrg?: GraphQLTypes["Org"] | undefined,
	createMenu?: GraphQLTypes["Menu"] | undefined,
	deleteArticleCategory?: boolean | undefined,
	createArticle?: GraphQLTypes["Article"] | undefined,
	deleteOrg?: boolean | undefined,
	updateRoleMenu?: boolean | undefined,
	publishArticle?: boolean | undefined,
	updateUser?: GraphQLTypes["User"] | undefined,
	deleteRole: boolean,
	updateComment?: GraphQLTypes["Comment"] | undefined,
	deleteArticle?: boolean | undefined,
	updateUserProfile?: boolean | undefined,
	deleteUser: boolean,
	registerUser?: boolean | undefined,
	loginByAccount?: string | undefined,
	createUser?: GraphQLTypes["User"] | undefined,
	deleteFileById: boolean
};
	["NullHandling"]: NullHandling;
	["Order"]: {
	__typename: "Order",
	direction?: GraphQLTypes["Direction"] | undefined,
	ignoreCase?: boolean | undefined,
	nullHandlingHint?: GraphQLTypes["NullHandling"] | undefined,
	property: string
};
	["Org"]: {
	__typename: "Org",
	address?: string | undefined,
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	/** id */
	id?: string | undefined,
	latitude: number,
	lead?: GraphQLTypes["User"] | undefined,
	leadId?: string | undefined,
	longitude: number,
	name?: string | undefined,
	openTime?: string | undefined,
	orgType?: GraphQLTypes["OrgTypeEnum"] | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined
};
	["OrgTypeEnum"]: OrgTypeEnum;
	["Page_Article"]: {
	__typename: "Page_Article",
	content?: Array<GraphQLTypes["Article"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: GraphQLTypes["Pagination"] | undefined,
	nextPageable?: GraphQLTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: GraphQLTypes["Pagination"] | undefined,
	previousOrFirstPageable?: GraphQLTypes["Pagination"] | undefined,
	previousPageable?: GraphQLTypes["Pagination"] | undefined,
	size: number,
	sort?: GraphQLTypes["Sorting"] | undefined,
	totalElements: GraphQLTypes["Long"],
	totalPages: number
};
	["Page_Comment"]: {
	__typename: "Page_Comment",
	content?: Array<GraphQLTypes["Comment"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: GraphQLTypes["Pagination"] | undefined,
	nextPageable?: GraphQLTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: GraphQLTypes["Pagination"] | undefined,
	previousOrFirstPageable?: GraphQLTypes["Pagination"] | undefined,
	previousPageable?: GraphQLTypes["Pagination"] | undefined,
	size: number,
	sort?: GraphQLTypes["Sorting"] | undefined,
	totalElements: GraphQLTypes["Long"],
	totalPages: number
};
	["Page_File"]: {
	__typename: "Page_File",
	content?: Array<GraphQLTypes["File"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: GraphQLTypes["Pagination"] | undefined,
	nextPageable?: GraphQLTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: GraphQLTypes["Pagination"] | undefined,
	previousOrFirstPageable?: GraphQLTypes["Pagination"] | undefined,
	previousPageable?: GraphQLTypes["Pagination"] | undefined,
	size: number,
	sort?: GraphQLTypes["Sorting"] | undefined,
	totalElements: GraphQLTypes["Long"],
	totalPages: number
};
	["Page_Org"]: {
	__typename: "Page_Org",
	content?: Array<GraphQLTypes["Org"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: GraphQLTypes["Pagination"] | undefined,
	nextPageable?: GraphQLTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: GraphQLTypes["Pagination"] | undefined,
	previousOrFirstPageable?: GraphQLTypes["Pagination"] | undefined,
	previousPageable?: GraphQLTypes["Pagination"] | undefined,
	size: number,
	sort?: GraphQLTypes["Sorting"] | undefined,
	totalElements: GraphQLTypes["Long"],
	totalPages: number
};
	["Page_Role"]: {
	__typename: "Page_Role",
	content?: Array<GraphQLTypes["Role"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: GraphQLTypes["Pagination"] | undefined,
	nextPageable?: GraphQLTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: GraphQLTypes["Pagination"] | undefined,
	previousOrFirstPageable?: GraphQLTypes["Pagination"] | undefined,
	previousPageable?: GraphQLTypes["Pagination"] | undefined,
	size: number,
	sort?: GraphQLTypes["Sorting"] | undefined,
	totalElements: GraphQLTypes["Long"],
	totalPages: number
};
	["Page_StudyPlan"]: {
	__typename: "Page_StudyPlan",
	content?: Array<GraphQLTypes["StudyPlan"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: GraphQLTypes["Pagination"] | undefined,
	nextPageable?: GraphQLTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: GraphQLTypes["Pagination"] | undefined,
	previousOrFirstPageable?: GraphQLTypes["Pagination"] | undefined,
	previousPageable?: GraphQLTypes["Pagination"] | undefined,
	size: number,
	sort?: GraphQLTypes["Sorting"] | undefined,
	totalElements: GraphQLTypes["Long"],
	totalPages: number
};
	["Page_User"]: {
	__typename: "Page_User",
	content?: Array<GraphQLTypes["User"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: GraphQLTypes["Pagination"] | undefined,
	nextPageable?: GraphQLTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: GraphQLTypes["Pagination"] | undefined,
	previousOrFirstPageable?: GraphQLTypes["Pagination"] | undefined,
	previousPageable?: GraphQLTypes["Pagination"] | undefined,
	size: number,
	sort?: GraphQLTypes["Sorting"] | undefined,
	totalElements: GraphQLTypes["Long"],
	totalPages: number
};
	["Page_WordRecord"]: {
	__typename: "Page_WordRecord",
	content?: Array<GraphQLTypes["WordRecord"] | undefined> | undefined,
	first: boolean,
	hasContent: boolean,
	hasNext: boolean,
	hasPrevious: boolean,
	last: boolean,
	nextOrLastPageable?: GraphQLTypes["Pagination"] | undefined,
	nextPageable?: GraphQLTypes["Pagination"] | undefined,
	number: number,
	numberOfElements: number,
	pageable?: GraphQLTypes["Pagination"] | undefined,
	previousOrFirstPageable?: GraphQLTypes["Pagination"] | undefined,
	previousPageable?: GraphQLTypes["Pagination"] | undefined,
	size: number,
	sort?: GraphQLTypes["Sorting"] | undefined,
	totalElements: GraphQLTypes["Long"],
	totalPages: number
};
	["Pagination"]: {
	__typename: "Pagination",
	pageNumber: number,
	pageSize?: number | undefined,
	sort?: GraphQLTypes["Sort"] | undefined
};
	/** Query root */
["Query"]: {
	__typename: "Query",
	app?: string | undefined,
	userInfo?: GraphQLTypes["UserInfoResult"] | undefined,
	queryMenuList?: Array<GraphQLTypes["Menu"] | undefined> | undefined,
	queryCommentPage?: GraphQLTypes["Page_Comment"] | undefined,
	queryArticleCategoryTree?: Array<GraphQLTypes["ArticleCategory"] | undefined> | undefined,
	queryUserPage?: GraphQLTypes["Page_User"] | undefined,
	queryStudyPlanPage?: GraphQLTypes["Page_StudyPlan"] | undefined,
	queryArticle?: GraphQLTypes["Article"] | undefined,
	queryMenuTree?: Array<GraphQLTypes["Menu"] | undefined> | undefined,
	queryRolePage?: GraphQLTypes["Page_Role"] | undefined,
	queryLoginSessionList?: Array<GraphQLTypes["LoginSessionResult"] | undefined> | undefined,
	queryRole?: GraphQLTypes["Role"] | undefined,
	queryUserList?: Array<GraphQLTypes["User"] | undefined> | undefined,
	queryAllRoleList?: Array<GraphQLTypes["Role"] | undefined> | undefined,
	queryDefaultRole?: Array<GraphQLTypes["DefaultRoleEnum"] | undefined> | undefined,
	queryArticlePage?: GraphQLTypes["Page_Article"] | undefined,
	queryWordRecordPage?: GraphQLTypes["Page_WordRecord"] | undefined,
	queryOrgPage?: GraphQLTypes["Page_Org"] | undefined,
	queryFilePage?: GraphQLTypes["Page_File"] | undefined,
	queryUser?: GraphQLTypes["User"] | undefined,
	queryArticleCategory?: Array<GraphQLTypes["ArticleCategory"] | undefined> | undefined,
	setDayPlanAndName?: boolean | undefined
};
	["QueryArticleCategorySpecificationInput"]: {
		name?: string | undefined,
	parentId?: string | undefined
};
	["QueryArticlePageSpecificationInput"]: {
		markdown?: string | undefined,
	pageNo: number,
	pageSize: number,
	sort?: string | undefined,
	title?: string | undefined
};
	["QueryCommentPageSpecificationInput"]: {
		orgId?: string | undefined,
	orgName?: string | undefined,
	pageNo: number,
	pageSize: number,
	sort?: string | undefined,
	type?: string | undefined,
	userId?: string | undefined,
	userName?: string | undefined
};
	["QueryOrgPageSpecificationInput"]: {
		address?: string | undefined,
	lat?: number | undefined,
	lng?: number | undefined,
	name?: string | undefined,
	orgType?: GraphQLTypes["OrgTypeEnum"] | undefined,
	pageNo: number,
	pageSize: number,
	sort?: string | undefined
};
	["QueryStudyPlanPageSpecificationInput"]: {
		pageNo: number,
	pageSize: number,
	sort?: string | undefined
};
	["QueryUserPageSpecificationInput"]: {
		email?: string | undefined,
	nickName?: string | undefined,
	orgId?: string | undefined,
	pageNo: number,
	pageSize: number,
	phone?: string | undefined,
	roleIds?: Array<string | undefined> | undefined,
	roleKey?: string | undefined,
	sort?: string | undefined,
	userName?: string | undefined
};
	["QueryUserSpecificationInput"]: {
		key?: string | undefined,
	nickName?: string | undefined,
	userName?: string | undefined
};
	["QueryWordRecordPageSpecificationInput"]: {
		pageNo: number,
	pageSize: number,
	sort?: string | undefined,
	type?: string | undefined
};
	["Role"]: {
	__typename: "Role",
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	default?: number | undefined,
	/** id */
	id?: string | undefined,
	key?: string | undefined,
	level?: number | undefined,
	menuIds?: Array<string | undefined> | undefined,
	menus?: Array<GraphQLTypes["Menu"] | undefined> | undefined,
	name?: string | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	users?: Array<GraphQLTypes["User"] | undefined> | undefined
};
	["RoleQueryParamInput"]: {
		createdAtFrom?: string | undefined,
	createdAtTo?: string | undefined,
	key?: string | undefined,
	name?: string | undefined,
	pageNo?: number | undefined,
	pageSize?: number | undefined,
	sort?: string | undefined
};
	["SetPlanAndNickNameInputInput"]: {
		dayCount?: number | undefined,
	nickName?: string | undefined
};
	["Sort"]: {
	__typename: "Sort",
	orders: Array<GraphQLTypes["Order"]>
};
	["Sorting"]: {
	__typename: "Sorting",
	orders: Array<GraphQLTypes["Order"]>
};
	["StudyPlan"]: {
	__typename: "StudyPlan",
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	date?: GraphQLTypes["LocalDate"] | undefined,
	dayCount?: number | undefined,
	/** id */
	id?: string | undefined,
	planCount?: number | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	user?: GraphQLTypes["User"] | undefined,
	userId?: string | undefined
};
	["UpdateArticleCategoryInputInput"]: {
		icon?: string | undefined,
	/** id */
	id?: string | undefined,
	name?: string | undefined,
	parentId?: string | undefined,
	sort?: number | undefined
};
	["UpdateArticleInputInput"]: {
		html?: string | undefined,
	/** id */
	id?: string | undefined,
	image?: string | undefined,
	markdown?: string | undefined,
	metaDescription?: string | undefined,
	metaTitle?: string | undefined,
	title?: string | undefined
};
	["UpdateCommentInputInput"]: {
		content?: string | undefined,
	/** id */
	id?: string | undefined
};
	["UpdateMenuInputInput"]: {
		component?: string | undefined,
	frame?: boolean | undefined,
	icon?: string | undefined,
	/** id */
	id?: string | undefined,
	name?: string | undefined,
	parentId?: string | undefined,
	path?: string | undefined,
	permission?: string | undefined,
	sort?: number | undefined,
	title?: string | undefined,
	type?: GraphQLTypes["MenuTypeEnum"] | undefined,
	visible?: boolean | undefined
};
	["UpdateOrgInputInput"]: {
		address?: string | undefined,
	/** id */
	id?: string | undefined,
	latitude: number,
	leadId?: string | undefined,
	longitude: number,
	name?: string | undefined,
	openTime?: string | undefined,
	orgType?: GraphQLTypes["OrgTypeEnum"] | undefined
};
	["UpdateRoleInputInput"]: {
		/** id */
	id?: string | undefined,
	key?: string | undefined,
	level?: number | undefined,
	name?: string | undefined
};
	["UpdateRoleMenuInputInput"]: {
		/** id */
	id?: string | undefined,
	menuIds?: Array<string | undefined> | undefined
};
	["UpdateUserInputInput"]: {
		avatar?: string | undefined,
	email?: string | undefined,
	gender?: GraphQLTypes["GenderEnum"] | undefined,
	/** id */
	id?: string | undefined,
	job?: string | undefined,
	nickName?: string | undefined,
	note?: string | undefined,
	orgId?: string | undefined,
	phone?: string | undefined,
	roleIds?: Array<string | undefined> | undefined,
	userName?: string | undefined
};
	["UpdateUserProfileInputInput"]: {
		avatar?: string | undefined,
	nickName?: string | undefined,
	oldPassword?: string | undefined,
	password?: string | undefined
};
	["User"]: {
	__typename: "User",
	avatar?: string | undefined,
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	dayCount?: number | undefined,
	email?: string | undefined,
	gender?: GraphQLTypes["GenderEnum"] | undefined,
	/** id */
	id?: string | undefined,
	job?: string | undefined,
	nickName?: string | undefined,
	note?: string | undefined,
	org?: GraphQLTypes["Org"] | undefined,
	orgId?: string | undefined,
	phone?: string | undefined,
	roles?: Array<GraphQLTypes["Role"] | undefined> | undefined,
	totalCount?: number | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	userName?: string | undefined
};
	["UserInfoResult"]: {
	__typename: "UserInfoResult",
	avatar?: string | undefined,
	dayCount?: number | undefined,
	email?: string | undefined,
	gender?: GraphQLTypes["GenderEnum"] | undefined,
	id?: string | undefined,
	menus?: Array<GraphQLTypes["Menu"] | undefined> | undefined,
	nickName?: string | undefined,
	passwordEnable: boolean,
	permissions?: Array<string | undefined> | undefined,
	phone?: string | undefined,
	roles?: Array<GraphQLTypes["Role"] | undefined> | undefined,
	superAdmin: boolean,
	totalCount?: number | undefined,
	userName?: string | undefined
};
	["UserLoginInputInput"]: {
		/** 用户名 */
	account?: string | undefined,
	/** 密码 */
	password?: string | undefined
};
	["UserRegisterInputInput"]: {
		account?: string | undefined,
	email?: string | undefined,
	nickName?: string | undefined,
	password?: string | undefined,
	phone?: string | undefined
};
	["WordRecord"]: {
	__typename: "WordRecord",
	/** 创建时间 */
	createdAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 创建人 */
	createdBy?: string | undefined,
	detail?: string | undefined,
	/** id */
	id?: string | undefined,
	image?: string | undefined,
	type?: string | undefined,
	/** 更新时间 */
	updatedAt?: GraphQLTypes["LocalDateTime"] | undefined,
	/** 更新人 */
	updatedBy?: string | undefined,
	user?: GraphQLTypes["User"] | undefined,
	userId?: string | undefined,
	word?: string | undefined
}
    }
export const enum ArticleStatusEnum {
	DRAFT = "DRAFT",
	PUBLISHED = "PUBLISHED"
}
export const enum DefaultRoleEnum {
	SUPER_ADMIN = "SUPER_ADMIN",
	USER = "USER"
}
export const enum Direction {
	ASC = "ASC",
	DESC = "DESC"
}
export const enum FileProviderEnum {
	BITIFUL_S4 = "BITIFUL_S4",
	LOCAL = "LOCAL",
	MINIO = "MINIO",
	URL = "URL"
}
export const enum GenderEnum {
	FEMALE = "FEMALE",
	MALE = "MALE",
	UNKNOWN = "UNKNOWN"
}
export const enum MenuTypeEnum {
	MENU = "MENU",
	PERMISSION = "PERMISSION"
}
export const enum NullHandling {
	NATIVE = "NATIVE",
	NULLS_FIRST = "NULLS_FIRST",
	NULLS_LAST = "NULLS_LAST"
}
export const enum OrgTypeEnum {
	COMMUNITY = "COMMUNITY",
	HOSPITAL = "HOSPITAL"
}

type ZEUS_VARIABLES = {
	["ArticleStatusEnum"]: ValueTypes["ArticleStatusEnum"];
	["CreateArticleCategoryInputInput"]: ValueTypes["CreateArticleCategoryInputInput"];
	["CreateArticleInputInput"]: ValueTypes["CreateArticleInputInput"];
	["CreateCommentInputInput"]: ValueTypes["CreateCommentInputInput"];
	["CreateMenuInputInput"]: ValueTypes["CreateMenuInputInput"];
	["CreateOrgInputInput"]: ValueTypes["CreateOrgInputInput"];
	["CreateRoleInputInput"]: ValueTypes["CreateRoleInputInput"];
	["CreateUserInputInput"]: ValueTypes["CreateUserInputInput"];
	["DefaultRoleEnum"]: ValueTypes["DefaultRoleEnum"];
	["Direction"]: ValueTypes["Direction"];
	["FileProviderEnum"]: ValueTypes["FileProviderEnum"];
	["FileQueryPageParamInput"]: ValueTypes["FileQueryPageParamInput"];
	["GenderEnum"]: ValueTypes["GenderEnum"];
	["LocalDate"]: ValueTypes["LocalDate"];
	["LocalDateTime"]: ValueTypes["LocalDateTime"];
	["Long"]: ValueTypes["Long"];
	["MenuQueryPageParamInput"]: ValueTypes["MenuQueryPageParamInput"];
	["MenuQueryParamInput"]: ValueTypes["MenuQueryParamInput"];
	["MenuTypeEnum"]: ValueTypes["MenuTypeEnum"];
	["NullHandling"]: ValueTypes["NullHandling"];
	["OrgTypeEnum"]: ValueTypes["OrgTypeEnum"];
	["QueryArticleCategorySpecificationInput"]: ValueTypes["QueryArticleCategorySpecificationInput"];
	["QueryArticlePageSpecificationInput"]: ValueTypes["QueryArticlePageSpecificationInput"];
	["QueryCommentPageSpecificationInput"]: ValueTypes["QueryCommentPageSpecificationInput"];
	["QueryOrgPageSpecificationInput"]: ValueTypes["QueryOrgPageSpecificationInput"];
	["QueryStudyPlanPageSpecificationInput"]: ValueTypes["QueryStudyPlanPageSpecificationInput"];
	["QueryUserPageSpecificationInput"]: ValueTypes["QueryUserPageSpecificationInput"];
	["QueryUserSpecificationInput"]: ValueTypes["QueryUserSpecificationInput"];
	["QueryWordRecordPageSpecificationInput"]: ValueTypes["QueryWordRecordPageSpecificationInput"];
	["RoleQueryParamInput"]: ValueTypes["RoleQueryParamInput"];
	["SetPlanAndNickNameInputInput"]: ValueTypes["SetPlanAndNickNameInputInput"];
	["UpdateArticleCategoryInputInput"]: ValueTypes["UpdateArticleCategoryInputInput"];
	["UpdateArticleInputInput"]: ValueTypes["UpdateArticleInputInput"];
	["UpdateCommentInputInput"]: ValueTypes["UpdateCommentInputInput"];
	["UpdateMenuInputInput"]: ValueTypes["UpdateMenuInputInput"];
	["UpdateOrgInputInput"]: ValueTypes["UpdateOrgInputInput"];
	["UpdateRoleInputInput"]: ValueTypes["UpdateRoleInputInput"];
	["UpdateRoleMenuInputInput"]: ValueTypes["UpdateRoleMenuInputInput"];
	["UpdateUserInputInput"]: ValueTypes["UpdateUserInputInput"];
	["UpdateUserProfileInputInput"]: ValueTypes["UpdateUserProfileInputInput"];
	["UserLoginInputInput"]: ValueTypes["UserLoginInputInput"];
	["UserRegisterInputInput"]: ValueTypes["UserRegisterInputInput"];
}