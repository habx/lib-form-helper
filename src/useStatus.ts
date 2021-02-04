import * as React from 'react'

import { FormContext } from './Form'
import { FormSectionContext } from './FormSection'

export const useStatus = () => {
  const form = React.useContext(FormContext)
  const section = React.useContext(FormSectionContext)

  return { form, section }
}
