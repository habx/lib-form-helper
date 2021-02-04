import { FormSectionRenderProps } from '../FormSection/FormSection.interface'

export interface FormSectionWatcherProps {
  id: string
  children: (status: FormSectionRenderProps) => JSX.Element
}
