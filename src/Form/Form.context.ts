import * as React from 'react'

import { FormContextProps } from './Form.interface'

export default React.createContext<FormContextProps>({
  disabled: false,
  showErrors: true,
  language: 'fr',
} as FormContextProps)