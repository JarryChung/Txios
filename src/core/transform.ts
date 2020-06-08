/**
 * 转换函数(transformRequest / transformResponse)的调用
 */

import { TxiosTransformer } from '../types'

/**
 * 逐个调用处理方法对 data、headers 进行处理
 * @param data 请求数据或响应数据
 * @param headers 请求头或响应头
 * @param fns 处理方法
 */
export default function transform(
  data: any,
  headers: any,
  fns?: TxiosTransformer | TxiosTransformer[]
): any {
  if (!fns) {
    return data
  }

  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach((fn) => {
    data = fn(data, headers)
  })

  return data
}
