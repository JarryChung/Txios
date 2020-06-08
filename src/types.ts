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

export interface TxiosStatic extends TxiosInstance {
  create(config?: TxiosRequestConfig): TxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

export interface TxiosRequestConfig {
  url?: string
  method?: Method
  timeout?: number
  data?: any
  params?: any
  headers?: any
  responsetype?: XMLHttpRequestResponseType

  transformRequest?: TxiosTransformer | TxiosTransformer[]
  transformResponse?: TxiosTransformer | TxiosTransformer[]

  cancelToken?: CancelToken

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

export interface TxiosTransformer {
  (data: any, headers?: any): any
}

// 实例类型
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

// 取消方法
export interface Canceler {
  (message?: string): void
}

// CancelToken 类构造函数参数的接口定义
export interface CancelExecutor {
  (cancel: Canceler): void
}

// CancelToken 类静态方法 source 函数的返回值类型
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// CancelToken 类的类类型
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

// Cancel 实例类型的接口定义
export interface Cancel {
  message?: string
}

// Cancel 类类型的接口定义
export interface CancelStatic {
  new (message?: string): Cancel
}
