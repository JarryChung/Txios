/**
 * headers 处理相关方法
 */

import { isPlainObject } from '../utils'

/**
 * 规范化请求头字段
 * @param headers 请求头
 * @param normalizedName 目标字段
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }

  Object.keys(headers).forEach((name) => {
    // 当目标字段与 headers 中的字段形式不同 且 二者大写相同时才需要转换
    // 如：content-type 与 Content-Type
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * 处理请求 headers
 * @param headers 请求 headers
 * @param data 请求数据
 */
export function parseRequestHeaders(headers: any, data: any): any {
  // 规范化 Content-Type 的表示
  normalizeHeaderName(headers, 'Content-Type')

  // 如果请求数据是一个纯对象 且 未设置 Content-Type
  // 那么将 Content-Type 设置上默认值：application/json;charset=utf-8
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

/**
 * 处理响应 headers
 * @param headers 响应 headers
 */
export function parseHeaders(headers: string): any {
  const parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  // 将字符串的 headers 转化为对象
  // 如：status:304\ndate:Fri, 05 Jun 2020 15:46:16 GMT
  // 转化为：{ status: '304', date: 'Fri, 05 Jun 2020 15:46:16 GMT' }
  headers.split('\n').forEach((line) => {
    const index = line.indexOf(':')
    const key = line.substr(0, index).toLowerCase()
    let val = line.substring(index + 1)
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })
  return parsed
}
