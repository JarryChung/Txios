/**
 * 接口声明
 */

export type Method = 'head' | 'options' | 'get' | 'delete' | 'put' | 'post' | 'patch'

export interface Txios {
  defaults: TxiosRequestConfig
  interceptors: {
    request: InterceptorManager<TxiosRequestConfig>
    response: InterceptorManager<TxiosResponse>
  }

  request<T = any>(config: TxiosRequestConfig): TxiosResponse<T>

  get<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>
  head<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>
  delete<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>
  options<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise<T>
}

export interface TxiosInstance extends Txios {
  <T = any>(config: TxiosRequestConfig): TxiosPromise<T>
  <T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>
}

export interface TxiosRequestConfig {
  url?: string
  method?: Method
  timeout?: number
  data?: any
  params?: any
  headers?: any
  responsetype?: XMLHttpRequestResponseType

  [propName: string]: any
}

export interface TxiosResponse<T = any> {
  status: number
  statusText: string
  headers: any
  data: T
  request: any
  config: TxiosRequestConfig
}

export interface TxiosPromise<T = any> extends Promise<TxiosResponse<T>> {}

export interface TxiosError extends Error {
  config: TxiosRequestConfig
  isTxiosError: boolean
  code?: string | null
  request?: any
  response?: TxiosResponse
}

export interface InterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: TxiosRequestConfig) => TxiosPromise)
  rejected?: RejectedFn
}
