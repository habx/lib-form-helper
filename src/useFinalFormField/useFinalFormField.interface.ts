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
  label?: string
  disabled?: boolean
  onChange: (value: FieldType, ...args: any[]) => void
  value: FieldType
  showError: boolean
  error: any
}
