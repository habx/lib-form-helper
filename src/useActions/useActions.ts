import * as React from 'react'

import { StatusContext } from '../contexts'

import Actions from './useActions.interface'

const useActions = (): Actions => {
  const formContext = React.useContext(StatusContext)

  return formContext.actions
}

export default useActions
