import { isEqual } from 'lodash'

const asyncDebounce = <D, Params extends any[]>(
  func: (...params: Params) => Promise<D> | D | undefined,
  time: number
) => {
  let memoizedParams: Params | undefined = undefined
  let memoizedResult: Promise<D> | D | undefined = undefined

  return (...params: Params) => {
    return new Promise<D | undefined>((resolve) => {
      // if same params return memoized value and avoid call function
      if (memoizedParams && isEqual(memoizedParams, params)) {
        return resolve(memoizedResult)
      }

      // reset memoized value at each call
      memoizedParams = params
      memoizedResult = undefined

      const resolveDebounce = () => {
        // flush old promises if out of date
        if (!isEqual(memoizedParams, params)) {
          resolve()
        }
        memoizedResult = func(...(memoizedParams ?? ([] as any)))
        return resolve(memoizedResult as D)
      }
      setTimeout(resolveDebounce, time)
    })
  }
}

export default asyncDebounce
