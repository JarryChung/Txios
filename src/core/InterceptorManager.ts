/**
 * 拦截器类文件
 * 拦截器相关各个类或接口的关系为：
 * Interceptors(接口)：类似于 axios.interceptors，是一个对象 {request, response}，值为 InterceptorManager 的实例
 * InterceptorManager(类)：即用来实例化 request / response，拥有方法 use(添加一个拦截器) / eject(移除) / forEach(用传入的函数遍历)
 * Interceptor(接口)：即具体的拦截器，是一个函数对象 { resolved(), rejected() }
 * 举例：txios.interceptors<1>.request<2>.use({ resolved, rejected }<3>)
 * <1>Interceptors / <2>InterceptorManager / <3>Interceptor
 */

import { ResolvedFn, RejectedFn } from '../types'

export interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected: RejectedFn): number {
    this.interceptors.push({ resolved, rejected })
    return this.interceptors.length - 1
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach((interceptor) => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }
}
