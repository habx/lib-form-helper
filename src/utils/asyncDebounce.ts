import { isEqual } from 'lodash'

export const asyncDebounce = <D, Value>(
  func: (value: Value, ...params: any[]) => Promise<D> | D | undefined,
  time: number
) => {
  let memoizedValue: Value | undefined = undefined
  let memoizedResult: Promise<D> | D | undefined = undefined

  return (value: Value, ...params: any[]) => {
    // if same params return memoized value and avoid call function
    if (memoizedValue && isEqual(value, memoizedValue)) {
      return memoizedResult
    }

    return new Promise<D | undefined>((resolve) => {
      // reset memoized value at each call
      memoizedValue = value
      memoizedResult = undefined
      const promiseParams = [value, ...params] as const

      const resolveDebounce = () => {
        // flush old promises if out of date
        if (!isEqual(memoizedValue, value)) {
          resolve(undefined)
          return
        }
        memoizedResult = func(...promiseParams)
        return resolve(memoizedResult as D)
      }
      setTimeout(resolveDebounce, time)
    })
  }
}
