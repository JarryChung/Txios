import { CancelExecutor, CancelTokenSource, Canceler } from '../types'
// 不从 types 中引入，因为 interface 只能当作类型，不能当作值
// 而类可当作类型或值
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>((resolve) => {
      resolvePromise = resolve
    })

    executor((message) => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken((c) => {
      // cancel 被赋值为上面的 message => {} 方法
      cancel = c
    })
    return { cancel, token }
  }
}
