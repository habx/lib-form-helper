import * as React from 'react'

const isServer = typeof window === 'undefined'

export default isServer ? React.useEffect : React.useLayoutEffect
