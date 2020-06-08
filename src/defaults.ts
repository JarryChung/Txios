/**
 * 默认配置
 */

import { TxiosRequestConfig } from './types'

const defaults: TxiosRequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
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
