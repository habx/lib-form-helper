import { InputHookConfig } from '../useFinalFormField/useFinalFormField.interface'

type validate<FieldValue, P> = (
  value: FieldValue,
  props: P
) => string | undefined
type format<FieldValue, P> = (value: FieldValue, props: P) => any
type parse<FieldValue, P> = (value: FieldValue, props: P) => any

export interface InputHOCConfig<FieldValue, P> extends InputHookConfig {
  validate?: validate<FieldValue, P>
  format?: format<FieldValue, P>
  parse?: parse<FieldValue, P>
  errorPadding?: number
}

export interface FieldContentReceivedProps {
  name: string
  label?: string
  required?: boolean
  disabled?: boolean
}

export interface FieldTransformationProps<FieldValue, P> {
  validate?: validate<FieldValue, P>
  format?: format<FieldValue, P>
  parse?: parse<FieldValue, P>
}
