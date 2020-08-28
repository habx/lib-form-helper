import * as React from 'react'

import FormWithoutTypes from './Form'
import FormProps from './Form/Form.interface'

// https://stackoverflow.com/questions/54269600/how-to-set-react-final-form-onsubmit-values-param-type-typescript
const withTypes = <T = Record<string, any>>() => {
  const Form = FormWithoutTypes as React.FunctionComponent<FormProps<T>>
  return { Form }
}

export default withTypes
