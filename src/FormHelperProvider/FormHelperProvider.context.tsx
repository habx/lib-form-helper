import * as React from 'react'

import FormHelperProviderProps from './FormHelperProvider.interface'

const DEFAULT_CONTEXT: FormHelperProviderProps = {
  intl: {
    required: 'obligatoire',
    containsErrors: 'contient des erreurs',
  },
  errors: {
    color: 'red',
    component: ({ children }) => <div>{children}</div>,
  },
}

export default React.createContext<FormHelperProviderProps>(DEFAULT_CONTEXT)
