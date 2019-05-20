import arrayMutators from 'final-form-arrays'
import { isFunction, forEach } from 'lodash'
import * as React from 'react'
import { Form as FinalForm } from 'react-final-form'

import { StatusContext, ErrorContext } from '../contexts'
import useKeyboardSave from '../useKeyboardSave'

import FormProps, { FormContentProps } from './Form.interface'

const useErrors = () => {
  const sections = React.useRef({})

  const handleSectionSubscription = React.useCallback((sectionId, section) => {
    sections.current[sectionId] = section
  }, [])

  const handleFieldError = React.useCallback((fieldID, sectionsPath, error) => {
    forEach(sectionsPath, sectionId => {
      if (sections.current[sectionId]) {
        sections.current[sectionId].callback(fieldID, error)
      }
    })
  }, [])

  return React.useMemo(
    () => ({
      subscribeSection: handleSectionSubscription,
      setFieldError: handleFieldError,
    }),
    [handleFieldError, handleSectionSubscription]
  )
}

const FormContent: React.FunctionComponent<FormContentProps> = ({
  render,
  form,
  shouldShowErrors,
  saveWithKeyboard,
  ...props
}) => {
  const errorContext = useErrors()
  const actions = React.useRef({
    change: (name: string, value?: any) => null,
  })

  useKeyboardSave(saveWithKeyboard && props.handleSubmit)

  React.useEffect(() => {
    actions.current = form
  }, [form])

  const showErrors = isFunction(shouldShowErrors)
    ? shouldShowErrors({ form, ...props })
    : true

  const statusContext = React.useMemo(
    () => ({
      disabled: props.submitting || props.disabled,
      showErrors,
    }),
    [props.submitting, props.disabled, showErrors]
  )

  return (
    <ErrorContext.Provider value={errorContext}>
      <StatusContext.Provider value={statusContext}>
        {render({ ...props, form })}
      </StatusContext.Provider>
    </ErrorContext.Provider>
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
