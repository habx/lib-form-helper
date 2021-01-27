import { FieldMetaState } from 'react-final-form'

import {
  InputHookConfig,
  UseFinalFormFieldValue,
  UseFinalFormReceivedProps,
} from '../useFinalFormField/useFinalFormField.interface'

export type ValidationCallback<FieldValue, Props> = (
  value: FieldValue | undefined,
  allValues: any,
  meta: FieldMetaState<FieldValue>,
  props: Props
) => string | undefined | Promise<string | undefined>

export type FormatterCallback<InputValue, Props, FieldValue = any> = (
  value: FieldValue | undefined,
  props: Props
) => InputValue | undefined

export type ParserCallback<InputValue, Props, FieldValue = any> = (
  value: InputValue,
  props: Props
) => FieldValue | undefined

export interface InputHOCConfig<InputValue, Props, FieldValue>
  extends InputHookConfig {
  /**
   * https://final-form.org/docs/react-final-form/types/FieldProps#validat
   * Pass props as last param
   */
  validate?: ValidationCallback<FieldValue, Props>

  /**
   * https://final-form.org/docs/react-final-form/types/FieldProps#format
   * Pass props as last param
   */
  format?: FormatterCallback<InputValue, Props, FieldValue>

  /**
   * https://final-form.org/docs/react-final-form/types/FieldProps#parse
   * Pass props as last param
   */
  parse?: ParserCallback<InputValue, Props, FieldValue>

  /**
   * Adapt behavior for array values
   * https://github.com/final-form/react-final-form-arrays
   */
  isArray?: boolean

  /**
   * Map field values returned by useFinalFormField to input props
   * Should return all passed fields if not overwritten
   * otherwise they won't be passed down to the input
   * @param fieldValue
   */
  mapFieldValueToProps?: (
    fieldValue: UseFinalFormFieldValue<FieldValue>
  ) => Props
}

export interface FieldContentReceivedProps<InputValue>
  extends UseFinalFormReceivedProps<InputValue> {
  name: string
}

export interface FieldTransformationProps<InputValue, Props> {
  validate?: ValidationCallback<InputValue, Props>
  format?: FormatterCallback<InputValue, Props>
  parse?: ParserCallback<InputValue, Props>
}
