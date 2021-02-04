import arrayMutators from 'final-form-arrays'
import { isFunction, forEach } from 'lodash'
import * as React from 'react'
import { withTypes } from 'react-final-form'

import {
  FormSectionContext,
  DEFAULT_SECTION_CONTEXT,
} from '../FormSection/FormSection.context'
import { useKeyboardSave } from '../useKeyboardSave'
import { IntlProvider } from '../useTranslate'

import { FormContext } from './Form.context'
import {
  FormProps,
  FormContextProps,
  FormStatusActions,
  SectionWatcher,
  Section,
  SectionCallback,
  FormContentProps,
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
      forEach(sectionsPath, (sectionUId) => {
        const section = sections.current[sectionUId]
        if (section) {
          section.callback(fieldID, type, value)

          forEach(sectionsWatchers.current[section.id], (watcherCallback) => {
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

function FormContent<Values, InitialValues>({
  render,
  form,
  shouldShowErrors,
  saveWithKeyboard,
  language = 'fr',
  ...props
}: FormContentProps<Values, InitialValues>) {
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
        <FormSectionContext.Provider value={DEFAULT_SECTION_CONTEXT}>
          {render({ ...props, form })}
        </FormSectionContext.Provider>
      </FormContext.Provider>
    </IntlProvider>
  )
}

export function Form<Values, InitialValues = Partial<Values>>({
  disabled = false,
  render,
  mutators,
  ...props
}: FormProps<Values, InitialValues>) {
  const { Form: FinalForm } = withTypes<Values, InitialValues>()

  return (
    <FinalForm
      {...props}
      mutators={{
        ...(arrayMutators as { [key: string]: any }),
        ...(mutators ?? {}),
      }}
      render={(renderProps) => (
        <FormContent<Values, InitialValues>
          {...renderProps}
          render={render}
          disabled={disabled}
        />
      )}
    />
  )
}
