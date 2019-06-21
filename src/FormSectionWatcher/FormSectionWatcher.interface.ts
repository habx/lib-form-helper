import { FormSectionRenderProps } from '../FormSection/FormSection.interface'

export default interface FormSectionWatcherProps {
  id: string
  children: (status: FormSectionRenderProps) => JSX.Element
}
