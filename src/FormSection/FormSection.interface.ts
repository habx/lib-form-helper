import * as React from 'react'

export default interface FormSectionProps {
  id?: string
  name?: string
  rootName?: string
  children?: React.ReactNode | ((status: FormSectionRenderProps) => JSX.Element)
}

export interface FormSectionStatusProps {
  error: { [key: number]: string }
  dirty: { [key: number]: boolean }
}

export interface FormSectionRenderProps {
  hasError: boolean
  isDirty: boolean
}

export interface SectionContextProps {
  name: string
  path: number[]
}
