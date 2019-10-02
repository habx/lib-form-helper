import * as React from 'react'

import FormHelperContext from './FormHelperProvider.context'
import FormHelperProviderProps from './FormHelperProvider.interface'

const FormHelperProvider: React.FunctionComponent<
  Partial<FormHelperProviderProps>
> = ({ children, ...props }) => {
  const parentValue = React.useContext(FormHelperContext)

  const value = React.useMemo(
    () => ({
      ...parentValue,
      ...props,
    }),
    [parentValue, props]
  )

  return (
    <FormHelperContext.Provider value={value}>
      {children}
    </FormHelperContext.Provider>
  )
}

export default FormHelperProvider
