import * as React from 'react'
import {
  FieldInputProps,
  FieldMetaState,
  UseFieldConfig,
} from 'react-final-form'

/**
 * Describes when the error should be displayed
 */
export type FieldErrorBehavior =
  /**
   * The error should always be displayed
   */
  | 'always'

  /**
   * The error should never be displayed
   */
  | 'never'

  /**
   * The error should only be displayed if the field has been edited
   */
  | 'dirty'

  /**
   * The error should only be displayed if the field has been touched and is currently not focused
   * This is the default behavior
   */
  | 'touched'

export interface InputHookConfig {
  changeOnBlur?: boolean
}

export interface UseFinalFormReceivedProps<FieldValue>
  extends UseFieldConfig<FieldValue> {
  label?: React.ReactNode
  required?: boolean
  disabled?: boolean

  /**
   * Error behavior to apply to this field
   * See FieldErrorBehavior for more information
   */
  errorBehavior?: FieldErrorBehavior
}

export interface UseFinalFormFieldValue<FieldValue> {
  input: FieldInputProps<FieldValue, HTMLElement>
  meta: FieldMetaState<FieldValue>
  label?: React.ReactNode
  disabled?: boolean
  onChange: (value: FieldValue, ...args: any[]) => void
  value: FieldValue

  /**
   * Should the error be displayed in the `FieldError` component
   */
  shouldDisplayInlineError: boolean

  /**
   * Should the input be in error mode
   */
  shouldBeInErrorMode: boolean

  errorColor: string
  error: any

  /**
   * Error behavior applied to this field
   * See FieldErrorBehavior for more information
   */
  errorBehavior: FieldErrorBehavior
}
