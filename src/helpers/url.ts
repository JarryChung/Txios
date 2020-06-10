/**
 * url 处理相关方法
 */

import { isDate, isPlainObject, isURLSearchParams } from '../utils'

interface URLOrigin {
  protocol: string
  host: string
}

/**
 * 反编码部分特殊字符
 * @param val 值
 */
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

// 利用 a 标签创建一个节点，利用该节点获得相应信息(这里是协议与 host)
const urlParsingNode = document.createElement('a')
// 获取当前页面 URL 的协议与 host
const originURL = resolveURL(location.href)

/**
 * 获取该 URL 对应的协议以及 host，利用了 a 标签的特性
 * @param url URL
 */
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return { protocol, host }
}

/**
 * 将 params 选项序列化为字符串并拼接到 url 后面
 * @param url URL
 * @param params params 选项
 */
export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }

  let serializedParams = undefined
  // 若传递了参数序列化方法，则使用该方法进行序列化
  // 否则判断是否为 URLSearchParams 实例，若是则返回该实例的字符串
  // 否则使用默认的参数序列化方法
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    Object.keys(params).forEach((key) => {
      const val = params[key]

      if (val === null || typeof val === 'undefined') {
        return
      }

      // 将 val 格式化为数组
      let values: any = []
      if (Array.isArray(val)) {
        values = val
        // 如果 val 为数组，则 key 末尾需要添加 []
        // 如：{ a: [1, 2] } 转化为 a[]=1&a[]=2
        key += '[]'
      } else {
        values = [val]
      }

      values.forEach((v: any) => {
        if (isDate(v)) {
          v = v.toISOString()
        } else if (isPlainObject(v)) {
          v = JSON.stringify(v)
        }
        parts.push(`${encode(key)}=${encode(v)}`)
      })
    })

    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    // 哈希符号(#)只在浏览器端起作用
    // 若 url 上有 # 符号，则去掉该符号以及后面的字符串
    const hashMarkIndex = url.indexOf('#')
    if (hashMarkIndex !== -1) {
      url = url.slice(0, hashMarkIndex)
    }
    // 如果 url 已经有问号，则用 & 连接 url 与参数字符串，否则用 ？ 连接
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

/**
 * 判断请求的 URL 与当前 URL 是否同域
 * @param url 请求的 URL
 */
export function isURLSameOrigin(url: string): boolean {
  const parsed = resolveURL(url)
  return parsed.host === originURL.host && parsed.protocol === originURL.protocol
}
