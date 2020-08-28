import { FormProps as FinalFormProps, FormRenderProps } from 'react-final-form'

interface AdditionalProps {
  disabled?: boolean
  shouldShowErrors?: (props: FormRenderProps) => boolean
  saveWithKeyboard?: boolean
  language?: 'fr' | 'en'
}

export default interface FormProps<D = Record<string, any>>
  extends FinalFormProps<D>,
    AdditionalProps {
  render: (props: FormRenderProps<D>) => JSX.Element
}

export interface FormContentProps extends FormRenderProps, AdditionalProps {
  render: (props: FormRenderProps) => JSX.Element
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
