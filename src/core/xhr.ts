/**
 * 真正发送请求的文件，xhr封装
 */

import { TxiosRequestConfig, TxiosPromise, TxiosResponse } from '../types'
import { createError } from '../helpers/error'
import { parseHeaders } from '../helpers/headers'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../utils'

export default function xhr(config: TxiosRequestConfig): TxiosPromise {
  return new Promise((resolve, reject) => {
    // 从用户传递的 config 中解构数据
    const {
      url,
      method = 'get',
      data = null,
      headers,
      timeout,
      responsetype,
      cancelToken,
      withCredentials,
      xsrfHeaderName,
      xsrfCookieName,
      onUploadProgress,
      onDownloadProgress,
      auth,
    } = config
    // 1. 创建 XHR 实例(每一个请求都会创建一个 XHR 实例)
    const request = new XMLHttpRequest()
    // 2. 执行 request.open 方法初始化
    request.open(method!.toUpperCase(), url!, true)
    // 3. 配置 request 对象
    configureRequest()
    // 4. 给 request 添加事件处理函数
    addEvents()
    // 5. 处理请求 headers
    handleHeaders()
    // 6. 处理请求取消逻辑
    handleCancel()
    // 7. 发送请求
    request.send(data)

    function configureRequest(): void {
      // 若用户配置了这些属性，则配置到 XHR 实例中
      responsetype && (request.responseType = responsetype)
      timeout && (request.timeout = timeout)
      withCredentials && (request.withCredentials = true)
    }

    function addEvents(): void {
      // 处理响应
      // 处理状态码
      request.onreadystatechange = function onLoad() {
        /**
         * 0	UNSENT	代理被创建，但尚未调用 open() 方法。
         * 1	OPENED	open() 方法已经被调用。
         * 2	HEADERS_RECEIVED	send() 方法已经被调用，并且头部和状态已经可获得。
         * 3	LOADING	下载中； responseText 属性已经包含部分数据。
         * 4	DONE	下载操作已完成。
         */
        if (request.readyState !== 4) {
          return
        }

        if (request.status === 0) {
          return
        }

        // 处理响应 headers 以及响应数据
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          responsetype && responsetype !== 'text' ? request.response : request.responseText
        const response: TxiosResponse = {
          data: responseData,
          headers: responseHeaders,
          status: request.status,
          statusText: request.statusText,
          config,
          request,
        }
        handleResponse(response)
      }

      // 处理错误，返回 TxiosError
      request.onerror = function onError() {
        reject(createError('An error occurred during the transaction', config, null, request))
      }

      // 处理超时，返回 TxiosError
      request.ontimeout = function onTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      if (typeof onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', onUploadProgress)
      }

      if (typeof onDownloadProgress === 'function') {
        request.addEventListener('progress', onDownloadProgress)
      }
    }

    function handleHeaders(): void {
      // 如果是 FormData 类型，那么由浏览器决定 Content-Type
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // 当 xsrfCookieName 不为空时，且满足以下条件之一，需要带上 cookie
      // 1. withCredentials 为 true
      // 2. 请求的 URL 与当前页面 URL 同域
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const value = cookie.read(xsrfCookieName)
        if (value && xsrfHeaderName) {
          headers[xsrfHeaderName] = value
        }
      }

      if (auth) {
        // Authorization 的定义参考
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
        headers['Authorization'] = `Basic ${btoa(`${auth.username}:${auth.password}`)}`
      }

      // 设置请求头
      Object.keys(headers).forEach((name) => {
        // 当数据为 null 时删除 Content-Type，由浏览器决定数据类型
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function handleCancel(): void {
      if (cancelToken) {
        // cancelToken 是 CancelToken class 的实例
        // 如果有 cancelToken，当该实例的 promise 为 resolved 时，取消请求
        cancelToken.promise.then((reason) => {
          request.abort()
          // 返回回来后，仍然会执行到这一步
          // 但因为 promise 状态已经变成 resolved，因此不会再 reject 出错误
          reject(reason)
        })
      }
    }

    // 默认的 response 处理方法，当且仅当状态码在 [200， 300) 之间才会正确返回数据，否则返回 TxiosError
    function handleResponse(response: TxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request fail with status ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
