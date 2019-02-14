import { FormProps as FinalFormProps, FormRenderProps } from 'react-final-form'

export default interface FormProps extends FinalFormProps {
  disabled?: boolean
  render: (props: FormRenderProps) => JSX.Element
}

export interface FormContentProps extends FormRenderProps {
  render: (props: FormRenderProps) => JSX.Element
  disabled?: boolean
}
