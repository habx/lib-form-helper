import { FieldRenderProps } from 'react-final-form'

import { SectionContextProps } from '../contexts'

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

export interface FieldWrapperReceivedProps {
  validate?: validate
  format?: format
  parse?: parse
  required?: boolean
  label?: string
  disabled?: boolean
  name: string
}

export interface FieldContentReceivedProps
  extends FieldRenderProps<HTMLElement> {
  innerName: string
  required?: boolean
  label?: string
  disabled?: boolean
  formDisabled?: boolean
  showErrors: boolean
  sectionContext: SectionContextProps
}
