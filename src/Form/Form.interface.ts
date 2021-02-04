import { FormProps as FinalFormProps, FormRenderProps } from 'react-final-form'

interface AdditionalProps<Values, InitialValues> {
  disabled?: boolean
  shouldShowErrors?: (props: FormRenderProps<Values, InitialValues>) => boolean
  saveWithKeyboard?: boolean
  language?: 'fr' | 'en'
}

export interface FormProps<
  Values = Record<string, any>,
  InitialValues = Partial<Values>
> extends FinalFormProps<Values, InitialValues>,
    AdditionalProps<Values, InitialValues> {
  render: Required<FormRenderProps<Values, InitialValues>>['render']
}

export interface FormContentProps<
  Values = Record<string, any>,
  InitialValues = Partial<Values>
> extends FormRenderProps<Values, InitialValues>,
    AdditionalProps<Values, InitialValues> {
  render: Required<FormRenderProps<Values, InitialValues>>['render']
}

export type SectionCallback = (
  fieldID: number,
  type: 'error' | 'dirty',
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
  showErrors: boolean
  language: 'fr' | 'en'
}
