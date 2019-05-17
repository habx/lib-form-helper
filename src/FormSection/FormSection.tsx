import { omit, isEmpty, isFunction } from 'lodash'
import * as React from 'react'

import { joinNames } from '../_internal/form'
import { StatusContext, SectionContext } from '../contexts'

import FormSectionProps, { FormSectionStatus } from './FormSection.interface'

const FormSection: React.FunctionComponent<FormSectionProps> = ({
  id,
  name,
  children,
}) => {
  const form = React.useContext(StatusContext)
  const parentSection = React.useContext(SectionContext)
  const [errors, updateErrors] = React.useState({})

  const status: FormSectionStatus = React.useMemo(
    () => ({
      hasError: !isEmpty(errors) && form.showErrors,
    }),
    [errors, form.showErrors]
  )

  React.useLayoutEffect(() => {
    form.setSectionStatus(id, status)
  }, [id, status]) // eslint-disable-line react-hooks/exhaustive-deps

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
      name: joinNames(parentSection.name, name),
    }),
    [form.showErrors, parentSection.name, name]
  )

  return (
    <SectionContext.Provider value={sectionStatus}>
      {isFunction(children) ? children(status) : children}
    </SectionContext.Provider>
  )
}

export default FormSection
