/**
 * 默认配置
 */

import { TxiosRequestConfig } from './types'
import { transformRequest, transformResponse } from './helpers/data'
import { parseRequestHeaders } from './helpers/headers'

const defaults: TxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
  },

  transformRequest: [
    function (data: any, headers: any): any {
      // 必须先处理 headers 再处理 data
      // 因为 headers 的内容会根据 data 的类型来确定，并且处理 data 时可能会 data 的类型
      parseRequestHeaders(headers, data)
      return transformRequest(data)
    },
  ],

  transformResponse: [
    function (data: any): any {
      return transformResponse(data)
    },
  ],

  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  },
}

const methodNoData: string[] = ['get', 'head', 'delete', 'options']
methodNoData.forEach((method) => {
  defaults.headers[method] = {}
})

const methodWithData: string[] = ['put', 'post', 'patch']
methodWithData.forEach((method) => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
})

export default defaults
