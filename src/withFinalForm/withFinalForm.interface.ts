import { FieldMetaState } from 'react-final-form'

import {
  FieldErrorBehavior,
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

export type FormatterCallback<
  InputValue,
  Props,
  FieldValue = any
> = FieldTransform<FieldValue, InputValue, Props>

export type ParserCallback<
  InputValue,
  Props,
  FieldValue = any
> = FieldTransform<InputValue, FieldValue, Props>

export interface FieldReceivedProps<InputValue>
  extends UseFinalFormReceivedProps<InputValue> {
  name: string
}

export interface FieldTransform<From, To, Props> {
  (value: From | undefined, props: Props): To | undefined
}

/** @internal */
export interface FieldTransformationProps<InputValue, FieldValue, Props> {
  /**
   * https://final-form.org/docs/react-final-form/types/FieldProps#validate
   * Pass props as last param
   */
  validate?: ValidationCallback<InputValue, Props>

  /**
   * https://final-form.org/docs/react-final-form/types/FieldProps#format
   * Pass props as last param
   */
  format?: FieldTransform<FieldValue, InputValue, Props>

  /**
   * https://final-form.org/docs/react-final-form/types/FieldProps#parse
   * Pass props as last param
   */
  parse?: FieldTransform<InputValue, FieldValue, Props>
}

export interface WithFinalFormOptions<InputValue, FieldValue, Props = any>
  extends InputHookConfig,
    FieldTransformationProps<InputValue, FieldValue, Props> {
  /**
   * Adapt behavior for array values
   * https://github.com/final-form/react-final-form-arrays
   */
  isArray?: boolean

  /**
   * Map field values returned by useFinalFormField to input props
   * Should return all passed fields if not overwritten
   * otherwise they won't be passed down to the input
   */
  mapFieldValueToProps?: (
    fieldValue: UseFinalFormFieldValue<FieldValue>
  ) => Props

  /**
   * Error behavior to apply to this field in none is specified in the props
   * See FieldErrorBehavior for more information
   */
  errorBehavior?: FieldErrorBehavior
}
