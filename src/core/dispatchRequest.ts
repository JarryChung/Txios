/**
 * 分发请求
 * 对 headers、配置、数据、错误进行处理
 * 在这里调用 xhr 文件导出的方法
 */

import { TxiosRequestConfig, TxiosPromise, TxiosResponse } from '../types'
import { buildURL } from '../helpers/url'
import { parseRequestHeaders } from '../helpers/headers'
import { transformRequest, transformResponse } from '../helpers/data'
import xhr from './xhr'

export default function dispatchRequest(config: TxiosRequestConfig): TxiosPromise {
  processConfig(config)
  return xhr(config).then((response) => {
    return transformResponseData(response)
  })
}

function processConfig(config: TxiosRequestConfig): void {
  config.url = transformURL(config)
  // 必须先处理 headers 再处理 data
  // 因为 headers 的内容会根据 data 的类型来确定，并且处理 data 时可能会 data 的类型
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

// 处理 URL，主要是将 params 序列化为字符串并添加到 URL 上
function transformURL(config: TxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

// 处理请求 Headers
function transformHeaders(config: TxiosRequestConfig): any {
  const { headers = {}, data } = config
  return parseRequestHeaders(headers, data)
}

// 处理请求数据
function transformRequestData(config: TxiosRequestConfig): any {
  return transformRequest(config.data)
}

// 处理响应数据
function transformResponseData(response: TxiosResponse): TxiosResponse {
  response.data = transformResponse(response.data)
  return response
}
