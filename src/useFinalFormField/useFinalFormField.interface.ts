import * as React from 'react'
import {
  FieldInputProps,
  FieldMetaState,
  UseFieldConfig,
} from 'react-final-form'

export interface InputHookConfig {
  changeOnBlur?: boolean
}

export interface UseFinalFormReceivedProps<FieldType>
  extends UseFieldConfig<FieldType> {
  label?: string
  required?: boolean
  disabled?: boolean
  shouldShowError?: (meta: FieldMetaState<any>) => boolean
}

export interface UseFinalFormFieldValue<FieldType> {
  input: FieldInputProps<FieldType, HTMLElement>
  meta: FieldMetaState<FieldType>
  label?: React.ReactNode
  disabled?: boolean
  onChange: (value: FieldType, ...args: any[]) => void
  value: FieldType

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
}
