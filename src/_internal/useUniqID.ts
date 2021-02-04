import * as React from 'react'

export const useUniqID = (): number => {
  const idRef = React.useRef<number>()

  if (idRef.current === undefined) {
    idRef.current = Math.random()
  }

  return idRef.current
}
