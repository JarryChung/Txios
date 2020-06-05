/**
 * 封装 Txios 的错误
 */

import { TxiosRequestConfig, TxiosResponse } from '../types'

/**
 * 定义 Txios 错误类，以区别其余错误
 */
export class TxiosError extends Error {
  config: TxiosRequestConfig
  isTxiosError: boolean
  code?: string | null
  request?: any
  response?: TxiosResponse

  constructor(
    message: string,
    config: TxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: TxiosResponse
  ) {
    super(message)
    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isTxiosError = true

    Object.setPrototypeOf(this, TxiosError.prototype)
  }
}

/**
 * 使用 工厂模式 创建一个 TxiosError 实例
 * @param message 错误信息
 * @param config 请求配置
 * @param code 状态码
 * @param request 请求
 * @param response 响应
 */
export function createError(
  message: string,
  config: TxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: TxiosResponse
) {
  return new TxiosError(message, config, code, request, response)
}
