import { FieldMetaState } from 'react-final-form'

import {
  InputHookConfig,
  UseFinalFormReceivedProps,
} from '../useFinalFormField/useFinalFormField.interface'

type ValidationCallback<FieldValue, P> = (
  value: FieldValue | undefined,
  allValues: any,
  meta?: FieldMetaState<FieldValue>
) => string | undefined | Promise<string | undefined>

type FormatterCallback<FieldValue, P> = (
  value: FieldValue | undefined,
  props: P
) => any

type ParserCallback<FieldValue, P> = (
  value: any,
  props: P
) => FieldValue | undefined

export interface InputHOCConfig<FieldValue, P> extends InputHookConfig {
  validate?: ValidationCallback<FieldValue, P>
  format?: FormatterCallback<FieldValue, P>
  parse?: ParserCallback<FieldValue, P>
  errorPadding?: number
  isArray?: boolean
}

export interface FieldContentReceivedProps<FieldValue>
  extends UseFinalFormReceivedProps<FieldValue> {
  name: string
}

export interface FieldTransformationProps<FieldValue, P> {
  validate?: ValidationCallback<FieldValue, P>
  format?: FormatterCallback<FieldValue, P>
  parse?: ParserCallback<FieldValue, P>
}
