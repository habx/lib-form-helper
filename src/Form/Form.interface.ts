import { FormProps as FinalFormProps, FormRenderProps } from 'react-final-form'

import { FieldErrorBehavior } from '../useFinalFormField'

interface FormAdditionalProps {
  disabled?: boolean
  language?: 'fr' | 'en'

  /**
   * Error behavior to apply to the fields of this form if none is given to useFinalFormField
   * See FieldErrorBehavior for more information
   */
  defaultErrorBehavior?: FieldErrorBehavior

  /**
   * @default true
   * Disable form submission if form is in submitting state
   * Useful for usage with useFormAutoSubmitDecorator
   */
  disableWhileSubmitting?: boolean
}

export interface FormProps<
  Values = Record<string, any>,
  InitialValues extends Partial<Values> = Partial<Values>
> extends FinalFormProps<Values, InitialValues>,
    FormAdditionalProps {
  render: Required<FormRenderProps<Values, InitialValues>>['render']
}

export interface FormContentProps<
  Values = Record<string, any>,
  InitialValues = Partial<Values>
> extends FormRenderProps<Values, InitialValues>,
    FormAdditionalProps {
  render: Required<FormRenderProps<Values, InitialValues>>['render']
}

export type FieldStatusType = 'error' | 'dirty'
export type SectionCallback = (
  fieldID: number,
  type: FieldStatusType,
  value: any
) => void

export type Section = {
  id: string
  callback: SectionCallback
}

export type SectionWatcher = {
  sectionId: string
  watcherId: number
  callback: SectionCallback
}

export interface FormStatusActions {
  subscribeSection: (sectionId: number, section: Section) => void
  subscribeSectionWatcher: (watcher: SectionWatcher) => void
  setFieldStatus: (
    fieldID: number,
    sections: number[],
    type: 'error' | 'dirty',
    value: any
  ) => void
}

export interface FormContextProps extends FormStatusActions {
  disabled?: boolean
  defaultErrorBehavior?: FieldErrorBehavior
  language: 'fr' | 'en'
}
