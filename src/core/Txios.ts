/**
 * Txios 类文件
 */

import { TxiosPromise, TxiosRequestConfig, Method } from '../types'
import dispatchRequest from './dispatchRequest'

export default class Txios {
  request(url: any, config?: any): TxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
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
