import { get, isNil, isFunction, every, includes, isString } from 'lodash'
import * as React from 'react'
import { FieldInputProps, FieldMetaState, useField } from 'react-final-form'

import { stringifyColor, useThemeVariant } from '@habx/ui-core'

import { useSSRLayoutEffect } from '../_internal/useSSRLayoutEffect'
import { useUniqID } from '../_internal/useUniqID'
import { REQUIRED_FIELD_ERROR } from '../FieldError/FieldError'
import { FormContext, FormContextProps } from '../Form'
import { FormSectionContext } from '../FormSection'
import { useTranslate } from '../useTranslate'
import { joinNames } from '../utils/joinNames'

import {
  InputHookConfig,
  UseFinalFormFieldValue,
  UseFinalFormReceivedProps,
} from './useFinalFormField.interface'

const useFieldStatus = ({
  error,
  dirty,
  path,
  formStatus: { setFieldStatus },
}: {
  error: any
  dirty?: boolean
  path: number[]
  formStatus: FormContextProps
}) => {
  const isFirst = React.useRef(true)
  const uniqID = useUniqID()

  React.useEffect(() => {
    if (!isFirst.current || error) {
      setFieldStatus(uniqID, path, 'error', error)
    }
  }, [error, path, setFieldStatus, uniqID])

  React.useEffect(() => {
    if (!isFirst.current || dirty) {
      setFieldStatus(uniqID, path, 'dirty', dirty)
    }
  }, [dirty, path, setFieldStatus, uniqID])

  useSSRLayoutEffect(() => {
    isFirst.current = false

    return () => {
      setFieldStatus(uniqID, path, 'error', undefined)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

const useLabel = ({
  error,
  required,
  label,
  shouldBeInErrorMode,
  errorColor,
}: {
  error: string | null
  shouldBeInErrorMode: boolean
  required?: boolean
  label?: string
  errorColor: string
}) => {
  const t = useTranslate()

  return React.useMemo(() => {
    if (!label) {
      return undefined
    }

    if (!shouldBeInErrorMode || !error) {
      if (required) {
        return `${label} *`
      }

      return label
    }

    if (error === REQUIRED_FIELD_ERROR) {
      return (
        <React.Fragment>
          {label} <span style={{ color: errorColor }}>*</span>
        </React.Fragment>
      )
    }

    if (error && typeof error === 'object') {
      return label
        ? `${label} (${t('errors.on.child', {}, { upperFirst: false })})`
        : t('errors.on.child', {}, { upperFirst: false })
    }

    if (error && typeof error !== 'object') {
      return `${label} : ${error}`
    }
  }, [label, shouldBeInErrorMode, error, required, errorColor, t])
}

/**
 * Wrapper to handle inputConfig.changeOnBlur behavior
 */
const useFieldValue = <FieldValue extends unknown>(
  input: FieldInputProps<FieldValue>,
  meta: FieldMetaState<FieldValue>,
  inputConfig: InputHookConfig
) => {
  const [localValue, setLocalValue] = React.useState(input.value)

  React.useEffect(() => {
    if (
      inputConfig.changeOnBlur &&
      !meta.active &&
      localValue !== input.value
    ) {
      input.onChange(localValue)
    }
  }, [meta.active]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (Array.isArray(input.value)) {
      const arrayLocalValue = (localValue || []) as any[]
      if (
        !every(input.value, (e) => includes(arrayLocalValue, e)) ||
        get(input.value, 'length') !== get(arrayLocalValue, 'length')
      ) {
        setLocalValue(input.value)
      }
    } else {
      setLocalValue(input.value)
    }
  }, [input.value]) // eslint-disable-line

  const handleChange = React.useCallback(
    (newRawValue) => {
      let newValue = newRawValue
      if (newRawValue?.target) {
        if (newRawValue.target?.type === 'checkbox') {
          newValue = newRawValue.target.checked
        } else {
          newValue = newRawValue.target.value
        }
      }

      if (inputConfig.changeOnBlur) {
        setLocalValue(newValue)
      } else {
        input.onChange(newValue)
      }
    },
    [input, inputConfig]
  )

  const value = React.useMemo(() => {
    if (inputConfig.changeOnBlur) {
      return (localValue as any)?.target
        ? (localValue as any).target.value
        : localValue
    }

    return input.value
  }, [input.value, inputConfig.changeOnBlur, localValue])

  return [value, handleChange] as const
}

export const useFinalFormField = <
  FieldValue extends unknown,
  Props extends UseFinalFormReceivedProps<FieldValue> = {}
>(
  baseName: string,
  props: Props | undefined,
  inputConfig: InputHookConfig = {}
): UseFinalFormFieldValue<FieldValue> => {
  const sectionContext = React.useContext(FormSectionContext)
  const name = joinNames(sectionContext.name, baseName)

  const { input, meta } = useField<FieldValue>(name, props)
  const theme = useThemeVariant()

  const { disabled, required, label: rawLabel } = props || {}

  const formStatus = React.useContext(FormContext)

  useFieldStatus({
    error: meta.error,
    dirty: meta.dirty,
    path: sectionContext.path,
    formStatus,
  })

  const error = React.useMemo(() => {
    const rawError = meta.error ?? meta.submitError

    if (isString(rawError)) {
      return rawError
    }

    return null
  }, [meta.error, meta.submitError])

  const [value, setValue] = useFieldValue(input, meta, inputConfig)

  const fieldShowError = isFunction(props?.shouldShowError)
    ? !!props?.shouldShowError(meta)
    : true

  const shouldBeInErrorMode =
    fieldShowError && !formStatus.disabled && formStatus.showErrors && !!error

  const shouldDisplayInlineError =
    shouldBeInErrorMode && error !== REQUIRED_FIELD_ERROR

  const errorColor = stringifyColor(theme.colors.error.base)

  const label = useLabel({
    error,
    shouldBeInErrorMode,
    label: rawLabel,
    required,
    errorColor,
  })

  return {
    input,
    meta,
    label,
    onChange: setValue,
    value,
    disabled: isNil(disabled) ? formStatus.disabled : disabled,
    shouldDisplayInlineError,
    shouldBeInErrorMode,
    error,
    errorColor,
  }
}
