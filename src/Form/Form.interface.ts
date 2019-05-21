import { FormProps as FinalFormProps, FormRenderProps } from 'react-final-form'

export default interface FormProps extends FinalFormProps {
  disabled?: boolean
  shouldShowErrors?: (props: FormRenderProps) => boolean
  saveWithKeyboard?: boolean
  render: (props: FormRenderProps) => JSX.Element
}

export interface FormContentProps extends FormRenderProps {
  render: (props: FormRenderProps) => JSX.Element
  shouldShowErrors?: (props: FormRenderProps) => boolean
  saveWithKeyboard?: boolean
  disabled?: boolean
}
