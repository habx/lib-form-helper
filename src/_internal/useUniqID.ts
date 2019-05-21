import * as React from 'react'

const useUniqID = (): number => {
  const idRef = React.useRef(null)

  if (idRef.current === null) {
    idRef.current = Math.random()
  }

  return idRef.current
}

export default useUniqID
