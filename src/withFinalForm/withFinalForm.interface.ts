import { FieldMetaState } from 'react-final-form'

import {
  InputHookConfig,
  UseFinalFormReceivedProps,
} from '../useFinalFormField/useFinalFormField.interface'

type ValidationCallback<FieldValue> = (
  value: FieldValue | undefined,
  allValues: any,
  meta?: FieldMetaState<FieldValue>
) => string | undefined | Promise<string | undefined>

type FormatterCallback<InputValue, Props, FieldValue = any> = (
  value: FieldValue | undefined,
  props: Props
) => InputValue | undefined

type ParserCallback<InputValue, Props, FieldValue = any> = (
  value: InputValue,
  props: Props
) => FieldValue | undefined

export interface InputHOCConfig<InputValue, Props, FieldValue>
  extends InputHookConfig {
  validate?: ValidationCallback<FieldValue>
  format?: FormatterCallback<InputValue, Props, FieldValue>
  parse?: ParserCallback<InputValue, Props, FieldValue>
  errorPadding?: number
  isArray?: boolean
}

export interface FieldContentReceivedProps<InputValue>
  extends UseFinalFormReceivedProps<InputValue> {
  name: string
}

export interface FieldTransformationProps<InputValue, Props> {
  validate?: ValidationCallback<InputValue>
  format?: FormatterCallback<InputValue, Props>
  parse?: ParserCallback<InputValue, Props>
}
