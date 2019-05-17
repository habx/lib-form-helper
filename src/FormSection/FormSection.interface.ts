import * as React from 'react'

export default interface FormSectionProps {
  id?: string
  name?: string
  children?: React.ReactNode | ((status: FormSectionStatus) => JSX.Element)
}

export type FormSectionStatus = {
  hasError: boolean
}
