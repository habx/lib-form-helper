import { FieldMetaState } from 'react-final-form'

import {
  InputHookConfig,
  UseFinalFormReceivedProps,
} from '../useFinalFormField/useFinalFormField.interface'

type ValidationCallback<FieldValue = any> = (
  value: FieldValue | undefined,
  allValues: any,
  meta?: FieldMetaState<FieldValue>
) => string | undefined | Promise<string | undefined>

type FormatterCallback<InputValue = any, Props = any, FieldValue = any> = (
  value: FieldValue | undefined,
  props: Props
) => InputValue | undefined

type ParserCallback<InputValue = any, Props = any, FieldValue = any> = (
  value: InputValue,
  props: Props
) => FieldValue | undefined

export interface InputHOCConfig<InputValue = any, Props = any, FieldValue = any>
  extends InputHookConfig {
  validate?: ValidationCallback<FieldValue>
  format?: FormatterCallback<InputValue, Props, FieldValue>
  parse?: ParserCallback<InputValue, Props, FieldValue>
  errorPadding?: number
  isArray?: boolean
}

export interface FieldContentReceivedProps<InputValue = any>
  extends UseFinalFormReceivedProps<InputValue> {
  name: string
}

export interface FieldTransformationProps<InputValue = any, Props = any> {
  validate?: ValidationCallback<InputValue>
  format?: FormatterCallback<InputValue, Props>
  parse?: ParserCallback<InputValue, Props>
}
