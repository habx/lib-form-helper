import * as React from 'react'

const isServer = typeof window === 'undefined'

export const useSSRLayoutEffect = isServer
  ? React.useEffect
  : React.useLayoutEffect
