/**
 * 工具函数
 */

/**
 * 获取值的类型
 * @param val 值
 */
function getType(val: any): string {
  return Object.prototype.toString.call(val).slice(8, -1)
}

/**
 * 是否为纯对象类型
 * @param val 值
 */
export function isPlainObject(val: any): val is Object {
  return getType(val) === 'Object'
}

/**
 * 是否为日期类型
 * @param val 值
 */
export function isDate(val: any): val is Date {
  return getType(val) === 'Date'
}

/**
 * 将 source 的属性挂载到 target 上，并返回 target
 * @param target 挂载目标
 * @param source 挂载源
 */
export function extend<T, S>(target: T, source: S): T & S {
  for (const key in source) {
    ;(target as T & S)[key] = source[key] as any
  }
  return target as T & S
}
