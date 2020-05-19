import {
  InputHookConfig,
  UseFinalFormReceivedProps,
} from '../useFinalFormField/useFinalFormField.interface'

type validate<FieldValue, P> = (
  value: FieldValue,
  props: P
) => string | undefined | Promise<string>
type format<FieldValue, P> = (value: FieldValue, props: P) => any
type parse<FieldValue, P> = (value: FieldValue, props: P) => any

export interface InputHOCConfig<FieldValue, P> extends InputHookConfig {
  validate?: validate<FieldValue, P>
  format?: format<FieldValue, P>
  parse?: parse<FieldValue, P>
  errorPadding?: number
  isArray?: boolean
}

export interface FieldContentReceivedProps<FieldValue>
  extends UseFinalFormReceivedProps<FieldValue> {
  name: string
}

export interface FieldTransformationProps<FieldValue, P> {
  validate?: validate<FieldValue, P>
  format?: format<FieldValue, P>
  parse?: parse<FieldValue, P>
}
