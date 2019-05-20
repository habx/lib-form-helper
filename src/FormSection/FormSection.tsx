import { isEmpty, isFunction, omitBy } from 'lodash'
import * as React from 'react'

import useUniqID from '../_internal/useUniqID'
import { StatusContext, SectionContext, ErrorContext } from '../contexts'
import joinNames from '../joinNames'

import FormSectionProps, { FormSectionStatus } from './FormSection.interface'

const FormSection: React.FunctionComponent<FormSectionProps> = ({
  id,
  name,
  rootName,
  children,
}) => {
  const uniqID = useUniqID()
  const form = React.useContext(StatusContext)
  const formErrors = React.useContext(ErrorContext)
  const parentSection = React.useContext(SectionContext)
  const [errors, updateErrors] = React.useState({})

  const sectionsPath = React.useMemo(() => [...parentSection.path, uniqID], [
    parentSection.path,
    uniqID,
  ])

  const status: FormSectionStatus = React.useMemo(
    () => ({
      hasError: !isEmpty(errors) && form.showErrors,
    }),
    [errors, form.showErrors]
  )

  const sectionStatus = React.useMemo(
    () => ({
      name: rootName ? rootName : joinNames(parentSection.name, name),
      path: sectionsPath,
    }),
    [rootName, parentSection.name, name, sectionsPath]
  )

  React.useLayoutEffect(() => {
    formErrors.subscribeSection(uniqID, {
      id,
      callback: (fieldID, error) => {
        updateErrors(prev => omitBy({ ...prev, [fieldID]: error }, el => !el))
      },
    })
  }, [formErrors, id, uniqID])

  return (
    <SectionContext.Provider value={sectionStatus}>
      {isFunction(children) ? children(status) : children}
    </SectionContext.Provider>
  )
}

export default FormSection
