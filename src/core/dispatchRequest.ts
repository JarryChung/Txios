/**
 * 分发请求
 * 对 headers、配置、数据、错误进行处理
 * 在这里调用 xhr 文件导出的方法
 */

import { TxiosRequestConfig, TxiosPromise, TxiosResponse } from '../types'
import { buildURL } from '../helpers/url'
import { parseRequestHeaders, flattenHeaders } from '../helpers/headers'
import { transformRequest, transformResponse } from '../helpers/data'
import xhr from './xhr'
import transform from './transform'

export default function dispatchRequest(config: TxiosRequestConfig): TxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then((response) => {
    return transformResponseData(response)
  })
}

function processConfig(config: TxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 处理 URL，主要是将 params 序列化为字符串并添加到 URL 上
function transformURL(config: TxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

// 处理响应数据
function transformResponseData(response: TxiosResponse): TxiosResponse {
  response.data = transform(response.data, response.headers, response.config.transformResponse)
  return response
}

// 发送请求前检查配置的 cancelToken 是否已经使用过，若已经被用过则不用法请求，直接抛异常
function throwIfCancellationRequested(config: TxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
