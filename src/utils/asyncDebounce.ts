import { isEqual } from 'lodash'

const asyncDebounce = (
  func: (...params: any[]) => Promise<any> | any,
  time: number
) => {
  const memoize: { params: any[]; result: any } = { params: [], result: null }
  return (...params: any[]) => {
    return new Promise((resolve) => {
      // if same params return memoized value and avoid call function
      if (isEqual(memoize.params, params)) {
        return resolve(memoize.result)
      }

      // reset memoized value at each call
      memoize.result = null
      memoize.params = params

      const resolveDebounce = () => {
        // flush old promises if out of date
        if (!isEqual(memoize.params, params)) {
          resolve()
        }
        memoize.result = func(...memoize.params)
        return resolve(memoize.result)
      }
      setTimeout(resolveDebounce, time)
    })
  }
}

export default asyncDebounce
