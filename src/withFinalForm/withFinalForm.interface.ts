import { FieldRenderProps } from 'react-final-form'

type validate = (value: any, props: object) => string | undefined
type format = (value: any, props: object) => any
type parse = (value: any, props: object) => any

export type InputConfig = {
  validate?: validate
  format?: format
  parse?: parse
  changeOnBlur?: boolean
  errorPadding?: number
}

export interface FieldWrapperProps {
  validate?: validate
  format?: format
  parse?: parse
  required?: boolean
  label?: string
  disabled?: boolean
  name: string
}

export interface FieldContentProps extends FieldRenderProps {
  innerName: string
  required?: boolean
  label?: string
  disabled?: boolean
  sectionContext: {
    setError: (sectionName: string, error: object) => void
  }
}
