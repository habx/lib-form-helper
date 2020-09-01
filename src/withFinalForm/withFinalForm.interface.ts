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

type FormatterCallback<FieldValue, Props> = (
  value: FieldValue | undefined,
  props: Props
) => any

type ParserCallback<FieldValue, Props> = (
  value: any,
  props: Props
) => FieldValue | undefined

export interface InputHOCConfig<FieldValue, Props> extends InputHookConfig {
  validate?: ValidationCallback<FieldValue>
  format?: FormatterCallback<FieldValue, Props>
  parse?: ParserCallback<FieldValue, Props>
  errorPadding?: number
  isArray?: boolean
}

export interface FieldContentReceivedProps<FieldValue>
  extends UseFinalFormReceivedProps<FieldValue> {
  name: string
}

export interface FieldTransformationProps<FieldValue, Props> {
  validate?: ValidationCallback<FieldValue>
  format?: FormatterCallback<FieldValue, Props>
  parse?: ParserCallback<FieldValue, Props>
}
