import type { IConfig, IKey, fetcherFn } from 'swrv/dist/types'
import useSWRV from 'swrv'

export function useRequest<Data = any, Error = any>(key: IKey, fn?: fetcherFn<Data>, config?: IConfig) {
  const swr = useSWRV(key, fn, config)
  const loading = !swr.data && !swr.error
  return { ...swr, loading }
}

export function useGraphqlRequest<Data = any, Error = any>(key: IKey, fn?: fetcherFn<Data>, config?: IConfig) {
  const swr = useSWRV(key, fn, config)
  const loading = !swr.data && !swr.error
  return { ...swr, loading }
}
