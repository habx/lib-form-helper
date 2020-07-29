import {
  InputHookConfig,
  UseFinalFormReceivedProps,
} from '../useFinalFormField/useFinalFormField.interface'

type Validate<FieldValue, P> = (
  value: FieldValue,
  props: P
) => string | undefined | Promise<string | undefined>
type Format<FieldValue, P> = (value: FieldValue, props: P) => any
type Parse<FieldValue, P> = (value: FieldValue, props: P) => any
type Normalize<FieldValue, P> = (value: FieldValue, props: P) => any

export interface InputHOCConfig<FieldValue, P> extends InputHookConfig {
  validate?: Validate<FieldValue, P>
  format?: Format<FieldValue, P>
  parse?: Parse<FieldValue, P>
  normalize?: Normalize<FieldValue, P>
  errorPadding?: number
  isArray?: boolean
}

export interface FieldContentReceivedProps<FieldValue>
  extends UseFinalFormReceivedProps<FieldValue> {
  name: string
  normalize?: Normalize<FieldValue, any>
}

export interface FieldTransformationProps<FieldValue, P> {
  validate?: Validate<FieldValue, P>
  format?: Format<FieldValue, P>
  parse?: Parse<FieldValue, P>
  normalize?: Normalize<FieldValue, P>
}
