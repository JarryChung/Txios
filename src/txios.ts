/**
 * 入口文件
 */

import { TxiosInstance, TxiosRequestConfig, TxiosStatic } from './types'
import Txios from './core/Txios'
import { extend } from './utils'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

// 工厂模式，创建一个方法 instance，并将 Txios 实例上的属性挂载到 instance 上
function createInstance(config: TxiosRequestConfig): TxiosStatic {
  // 创建 Txios 实例
  const context = new Txios(config)
  // instance 变量存储的是 Txios 类中的 request 方法
  const instance = Txios.prototype.request.bind(context)
  // 将 Txios 实例上的属性挂载到 instance 上
  extend(instance, context)
  // 返回该方法
  return instance as TxiosStatic
}

// 利用工厂方法创建实例
const txios = createInstance(defaults)

// 该方法创建指定配置的实例
txios.create = function (config?: TxiosRequestConfig): TxiosInstance {
  return createInstance(mergeConfig(defaults, config))
}

// 添加静态方法
txios.CancelToken = CancelToken
txios.Cancel = Cancel
txios.isCancel = isCancel

// 导出
export default txios
