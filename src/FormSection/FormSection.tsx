import { omit, isEmpty, isFunction } from 'lodash'
import * as React from 'react'

import { StatusContext, SectionContext } from '../contexts'

import FormSectionProps, { FormSectionStatus } from './FormSection.interface'

const FormSection: React.FunctionComponent<FormSectionProps> = ({
  name,
  children,
}) => {
  const form = React.useContext(StatusContext)
  const [errors, updateErrors] = React.useState({})

  const status: FormSectionStatus = React.useMemo(
    () => ({
      hasError: !isEmpty(errors) && form.showErrors,
    }),
    [errors, form.showErrors]
  )

  React.useEffect(() => form.setSectionStatus(name, status), [
    form,
    name,
    status,
  ])

  const sectionStatus = React.useMemo(
    () => ({
      setError: (fieldName: string, error: string) => {
        updateErrors(prevErrors =>
          error
            ? { ...prevErrors, [fieldName]: error }
            : omit(prevErrors, [fieldName])
        )
      },
      showErrors: form.showErrors,
    }),
    [updateErrors, form.showErrors]
  )

  return (
    <SectionContext.Provider value={sectionStatus}>
      {isFunction(children) ? children(status) : children}
    </SectionContext.Provider>
  )
}

export default FormSection
