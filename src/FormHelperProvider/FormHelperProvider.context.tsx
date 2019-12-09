import * as React from 'react'

import FormHelperProviderProps from './FormHelperProvider.interface'

const DEFAULT_CONTEXT: FormHelperProviderProps = {
  errors: {
    color: 'red',
    component: ({ children }) => <div>{children}</div>,
  },
}

export default React.createContext<FormHelperProviderProps>(DEFAULT_CONTEXT)
