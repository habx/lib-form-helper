import arrayMutators from 'final-form-arrays'
import { isFunction, forEach } from 'lodash'
import * as React from 'react'
import { Form as FinalForm } from 'react-final-form'

import useKeyboardSave from '../useKeyboardSave'
import { IntlProvider } from '../useTranslate'

import FormContext from './Form.context'
import FormProps, {
  FormContentProps,
  FormContextProps,
  FormStatusActions,
  SectionWatcher,
  Section,
  SectionCallback,
} from './Form.interface'
import * as messages from './Form.messages'

const useStatuses = (): FormStatusActions => {
  const sections = React.useRef<{
    [sectionId: string]: Section | null
  }>({})
  const sectionsWatchers = React.useRef<{
    [sectionId: string]: { [watcherId: number]: SectionCallback }
  }>({})

  const handleSectionSubscription = React.useCallback((sectionUId, section) => {
    sections.current[sectionUId] = section

    return () => {
      sections.current[sectionUId] = null
    }
  }, [])

  const handleSectionWatcherSubscription = React.useCallback(
    (sectionWatcher: SectionWatcher) => {
      sectionsWatchers.current[sectionWatcher.sectionId] = {
        ...(sectionsWatchers.current[sectionWatcher.sectionId] || {}),
        [sectionWatcher.watcherId]: sectionWatcher.callback,
      }
    },
    []
  )

  const handleFieldStatusChange = React.useCallback(
    (fieldID, sectionsPath, type, value) => {
      forEach(sectionsPath, sectionUId => {
        const section = sections.current[sectionUId]
        if (section) {
          section.callback(fieldID, type, value)

          forEach(sectionsWatchers.current[section.id], watcherCallback => {
            watcherCallback(fieldID, type, value)
          })
        }
      })
    },
    []
  )

  return React.useMemo(
    () => ({
      setFieldStatus: handleFieldStatusChange,
      subscribeSection: handleSectionSubscription,
      subscribeSectionWatcher: handleSectionWatcherSubscription,
    }),
    [
      handleFieldStatusChange,
      handleSectionSubscription,
      handleSectionWatcherSubscription,
    ]
  )
}

const FormContent: React.FunctionComponent<FormContentProps> = ({
  render,
  form,
  shouldShowErrors,
  saveWithKeyboard,
  language = 'fr',
  ...props
}) => {
  const statusActions = useStatuses()

  useKeyboardSave(saveWithKeyboard ? props.handleSubmit : undefined)

  const showErrors = isFunction(shouldShowErrors)
    ? shouldShowErrors({ form, ...props })
    : true

  const statusContext = React.useMemo<FormContextProps>(
    () => ({
      ...statusActions,
      disabled: props.submitting || props.disabled,
      showErrors,
      language,
    }),
    [statusActions, props.submitting, props.disabled, showErrors, language]
  )

  return (
    <IntlProvider
      locale={language}
      messages={language === 'fr' ? messages.fr : messages.en}
    >
      <FormContext.Provider value={statusContext}>
        {render({ ...props, form })}
      </FormContext.Provider>
    </IntlProvider>
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
