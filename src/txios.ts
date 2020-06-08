/**
 * 入口文件
 */

import { TxiosInstance, TxiosRequestConfig } from './types'
import Txios from './core/Txios'
import { extend } from './utils'
import defaults from './defaults'

// 工厂模式，创建一个方法 instance，并将 Txios 实例上的属性挂载到 instance 上
function createInstance(config: TxiosRequestConfig): TxiosInstance {
  // 创建 Txios 实例
  const context = new Txios(config)
  // instance 变量存储的是 Txios 类中的 request 方法
  const instance = Txios.prototype.request.bind(context)
  // 将 Txios 实例上的属性挂载到 instance 上
  extend(instance, context)
  // 返回该方法
  return instance as TxiosInstance
}

// 利用工厂方法创建实例
const txios = createInstance(defaults)
// 导出
export default txios
