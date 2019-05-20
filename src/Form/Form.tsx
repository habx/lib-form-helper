import arrayMutators from 'final-form-arrays'
import { isFunction, forEach } from 'lodash'
import * as React from 'react'
import { Form as FinalForm } from 'react-final-form'

import { StatusContext } from '../contexts'
import useKeyboardSave from '../useKeyboardSave'

import FormProps, { FormContentProps } from './Form.interface'

const useStatuses = () => {
  const sections = React.useRef({})

  const handleSectionSubscription = React.useCallback((sectionId, section) => {
    sections.current[sectionId] = section
  }, [])

  const handleFieldStatusChange = React.useCallback(
    (fieldID, sectionsPath, type, value) => {
      forEach(sectionsPath, sectionId => {
        if (sections.current[sectionId]) {
          sections.current[sectionId].callback(fieldID, type, value)
        }
      })
    },
    []
  )

  return { handleFieldStatusChange, handleSectionSubscription }
}

const FormContent: React.FunctionComponent<FormContentProps> = ({
  render,
  form,
  shouldShowErrors,
  saveWithKeyboard,
  ...props
}) => {
  const { handleFieldStatusChange, handleSectionSubscription } = useStatuses()

  useKeyboardSave(saveWithKeyboard && props.handleSubmit)

  const showErrors = isFunction(shouldShowErrors)
    ? shouldShowErrors({ form, ...props })
    : true

  const statusContext = React.useMemo(
    () => ({
      disabled: props.submitting || props.disabled,
      showErrors,
      setFieldStatus: handleFieldStatusChange,
      subscribeSection: handleSectionSubscription,
    }),
    [
      props.submitting,
      props.disabled,
      showErrors,
      handleFieldStatusChange,
      handleSectionSubscription,
    ]
  )

  return (
    <StatusContext.Provider value={statusContext}>
      {render({ ...props, form })}
    </StatusContext.Provider>
  )
}

const Form: React.FunctionComponent<FormProps> = ({
  disabled,
  render,
  ...props
}) => (
  <FinalForm
    {...props}
    mutators={arrayMutators as { [key: string]: any }}
    render={props => (
      <FormContent {...props} render={render} disabled={disabled} />
    )}
  />
)

Form.defaultProps = {
  disabled: false,
}

export default Form
