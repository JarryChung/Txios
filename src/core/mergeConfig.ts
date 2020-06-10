/**
 * 配置合并，采用策略模式
 */

import { TxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../utils'

const strategies = Object.create(null)

/**
 * 默认的合并策略，当 val2 存在时返回 val2，否则返回 val1
 * @param val1 值1
 * @param val2 值2
 */
function defaultStrategy(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

/**
 * 只返回 val2 的合并策略，当 val2 有效时才会返回
 * @param val1 值1
 * @param val2 值2
 */
function valFromConfig2(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

/**
 * 复杂对象的合并策略
 * @param val1 值1
 * @param val2 值2
 */
function mergeDeepValues(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    return val1
  }
}

// url / method / data 只来自于用户的配置，即 config2
const valueFromConfig2Keys: string[] = ['url', 'method', 'data']
valueFromConfig2Keys.forEach((key) => {
  strategies[key] = valFromConfig2
})

// headers 需要进行深度合并
const mergeDeepPropertiesKeys = ['headers', 'auth']
mergeDeepPropertiesKeys.forEach((key) => {
  strategies[key] = mergeDeepValues
})

/**
 * 合并两份配置并返回一个新的配置对象
 * @param config1 TxiosRequestConfig 配置1
 * @param config2 TxiosRequestConfig 配置2
 */
export default function mergeConfig(
  config1: TxiosRequestConfig,
  config2?: TxiosRequestConfig
): TxiosRequestConfig {
  config2 = config2 || {}

  const config: TxiosRequestConfig = Object.create(null)

  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    // 若上一轮合并过，则不要进行重复合并
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 选择响应的合并策略，若未定义策略，则使用默认策略
    const strategy = strategies[key] || defaultStrategy
    config[key] = strategy(config1[key], config2![key])
  }

  return config
}
