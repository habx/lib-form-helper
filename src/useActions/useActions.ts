import * as React from 'react'
import { StatusContext } from '../contexts'

const useActions = () => {
  const formContext = React.useContext(StatusContext)

  return formContext.actions
}

export default useActions
