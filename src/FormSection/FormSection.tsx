import * as React from 'react'
import PropTypes from 'prop-types'
import { omit, isEmpty } from 'lodash'

import { StatusContext, SectionContext } from '../contexts'
import { FormSectionStatus } from './FormSection.interface'

const useSectionStatus = name => {
  const form = React.useContext(StatusContext)
  const [errors, updateErrors] = React.useState({})

  React.useEffect(
    () => {
      const status: FormSectionStatus = {
        hasError: !isEmpty(errors)
      }

      form.setSectionStatus(name, status)
    },
    [name, errors, form.setSectionStatus])

  return React.useMemo(
    () => ({
      setError: (fieldName: string, error: string) => {
        updateErrors(prevErrors =>
          error
            ? { ...prevErrors, [fieldName]: error }
            : omit(prevErrors, [fieldName])
        )
      }
    }),
    [updateErrors]
  )
}

const FormSection = ({ name, children }) => {
  const sectionStatus = useSectionStatus(name)

  return (
    <SectionContext.Provider value={sectionStatus}>
      { children }
    </SectionContext.Provider>
  )
}

FormSection.propTypes = {
  name: PropTypes.string.isRequired
}

export default FormSection
