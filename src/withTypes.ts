import * as React from 'react'

import FormWithoutTypes from './Form'
import FormProps from './Form/Form.interface'

const withTypes = <T = Record<string, any>>() => {
  const Form = FormWithoutTypes as React.FunctionComponent<FormProps<T>>
  return { Form }
}

export default withTypes
