import { FormProps as FinalFormProps, FormRenderProps } from 'react-final-form'

interface AdditionalProps {
  disabled?: boolean
  shouldShowErrors?: (props: FormRenderProps) => boolean
  saveWithKeyboard?: boolean
  language?: 'fr' | 'en'
}

export default interface FormProps extends FinalFormProps, AdditionalProps {
  render: (props: FormRenderProps) => JSX.Element
}

export interface FormContentProps extends FormRenderProps, AdditionalProps {
  render: (props: FormRenderProps) => JSX.Element
}
