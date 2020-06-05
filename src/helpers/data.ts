/**
 * 数据处理相关方法
 */

import { isPlainObject } from '../utils'

/**
 * 转化请求数据
 * @param data 值
 */
export function transformRequest(data: any): any {
  // 如果 data 是个纯对象，那么转化为 string，否则不处理
  return isPlainObject(data) ? JSON.stringify(data) : data
}

/**
 * 转化响应数据
 * @param data 值
 */
export function transformResponse(data: any): any {
  // 如果响应数据类型为 string，则尝试转化为对象
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      // do nothing
    }
  }
  return data
}
