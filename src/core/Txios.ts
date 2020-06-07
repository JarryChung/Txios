/**
 * Txios 类文件
 */

import { TxiosPromise, TxiosRequestConfig, Method, TxiosResponse, PromiseChain } from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'

interface Interceptors {
  request: InterceptorManager<TxiosRequestConfig>
  response: InterceptorManager<TxiosResponse>
}

export default class Txios {
  interceptors: Interceptors

  constructor() {
    this.interceptors = {
      request: new InterceptorManager<TxiosRequestConfig>(),
      response: new InterceptorManager<TxiosResponse>(),
    }
  }

  request(url: any, config?: any): TxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    const promiseChain: Array<PromiseChain<any>> = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ]

    this.interceptors.request.forEach((interceptor) => {
      promiseChain.unshift(interceptor)
    })

    this.interceptors.response.forEach((interceptor) => {
      promiseChain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (promiseChain.length) {
      const { resolved, rejected } = promiseChain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  get(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._methodsNoData('get', url, config)
  }

  head(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._methodsNoData('head', url, config)
  }

  delete(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._methodsNoData('delete', url, config)
  }

  options(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._methodsNoData('options', url, config)
  }

  put(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this._methodsWithData('put', url, data, config)
  }

  post(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this._methodsWithData('post', url, data, config)
  }

  patch(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this._methodsWithData('patch', url, data, config)
  }

  private _methodsNoData(method: Method, url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this.request(Object.assign(config || {}, { url, method }))
  }

  private _methodsWithData(
    method: Method,
    url: string,
    data?: any,
    config?: TxiosRequestConfig
  ): TxiosPromise {
    return this.request(Object.assign(config || {}, { url, data, method }))
  }
}
