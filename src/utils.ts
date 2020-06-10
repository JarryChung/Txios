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

export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
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

/**
 * 深度合并多个对象，并以新对象的形式返回
 * @param objs 多个对象
 */
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}
