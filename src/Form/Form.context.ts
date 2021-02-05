import * as React from 'react'

import { FormContextProps } from './Form.interface'

export const FormContext = React.createContext<FormContextProps>({
  disabled: false,
  language: 'fr',
} as FormContextProps)
