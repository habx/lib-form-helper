import * as React from 'react'

import FormHelperContext from './FormHelperProvider.context'
import FormHelperProviderProps from './FormHelperProvider.interface'

/**
 * @deprecated @habx/lib-form-helper is now bundling @habx/ui-core, which make this override irrelevant and not compatible with local them patches
 */
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
