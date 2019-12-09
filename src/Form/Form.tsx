import arrayMutators from 'final-form-arrays'
import { isFunction, forEach } from 'lodash'
import * as React from 'react'
import { Form as FinalForm } from 'react-final-form'

import { StatusContext } from '../contexts'
import useKeyboardSave from '../useKeyboardSave'

import FormProps, { FormContentProps } from './Form.interface'

const useStatuses = () => {
  const sections = React.useRef({})
  const sectionsWatchers = React.useRef({})

  const handleSectionSubscription = React.useCallback((sectionUId, section) => {
    sections.current[sectionUId] = section

    return () => {
      sections.current[sectionUId] = null
    }
  }, [])

  const handleSectionWatcherSubscription = React.useCallback(sectionWatcher => {
    sectionsWatchers.current[sectionWatcher.id] = {
      ...(sectionsWatchers.current[sectionWatcher.id] || {}),
      [sectionWatcher.uId]: sectionWatcher.callback,
    }
  }, [])

  const handleFieldStatusChange = React.useCallback(
    (fieldID, sectionsPath, type, value) => {
      forEach(sectionsPath, sectionUId => {
        if (sections.current[sectionUId]) {
          const { id, callback } = sections.current[sectionUId]
          callback(fieldID, type, value)

          forEach(sectionsWatchers.current[id], watcherCallback => {
            watcherCallback(fieldID, type, value)
          })
        }
      })
    },
    []
  )

  return {
    handleFieldStatusChange,
    handleSectionSubscription,
    handleSectionWatcherSubscription,
  }
}

const FormContent: React.FunctionComponent<FormContentProps> = ({
  render,
  form,
  shouldShowErrors,
  saveWithKeyboard,
  language = 'fr',
  ...props
}) => {
  const {
    handleFieldStatusChange,
    handleSectionSubscription,
    handleSectionWatcherSubscription,
  } = useStatuses()

  useKeyboardSave(saveWithKeyboard && props.handleSubmit)

  const showErrors = isFunction(shouldShowErrors)
    ? shouldShowErrors({ form, ...props })
    : true

  const statusContext = React.useMemo(
    () => ({
      disabled: props.submitting || props.disabled,
      showErrors,
      language,
      setFieldStatus: handleFieldStatusChange,
      subscribeSection: handleSectionSubscription,
      subscribeSectionWatcher: handleSectionWatcherSubscription,
    }),
    [
      props.submitting,
      props.disabled,
      showErrors,
      language,
      handleFieldStatusChange,
      handleSectionSubscription,
      handleSectionWatcherSubscription,
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
