import { FieldRenderProps } from 'react-final-form'

import { SectionContextProps } from '../contexts'

type validate<Props> = (value: any, props: Props) => string | undefined
type format<Props> = (value: any, props: Props) => any
type parse<Props> = (value: any, props: Props) => any

export type InputConfig<Props> = {
  validate?: validate<Props>
  format?: format<Props>
  parse?: parse<Props>
  changeOnBlur?: boolean
  errorPadding?: number
}

export interface FieldWrapperReceivedProps<Props> {
  validate?: validate<Props>
  format?: format<Props>
  parse?: parse<Props>
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
