import { get, isNil, isFunction, every, includes } from 'lodash'
import * as React from 'react'
import { useField } from 'react-final-form'

import useSSRLayoutEffect from '../_internal/useSSRLayoutEffect'
import useUniqID from '../_internal/useUniqID'
import { FormContext, FormContextProps } from '../Form'
import { FormSectionContext } from '../FormSection'
import joinNames from '../joinNames'
import useTranslate from '../useTranslate'

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
  formStatus,
}: {
  error: any
  required?: boolean
  label?: string
  formStatus: FormContextProps
}) => {
  const t = useTranslate()
  return React.useMemo(() => {
    if (!formStatus.showErrors) {
      return label
    }

    if (!label) {
      return null
    }

    if (!error || error === 'required') {
      return `${label}${
        required
          ? ` (${t('errors.required.short', {}, { upperFirst: false })})`
          : ''
      }`
    }

    if (error && typeof error === 'object') {
      return label
        ? `${label} (${t('errors.on.child', {}, { upperFirst: false })})`
        : t('errors.on.child', {}, { upperFirst: false })
    }

    if (error && typeof error !== 'object') {
      return `${label} : ${error}`
    }
  }, [formStatus.showErrors, label, error, required, t])
}

const useFinalFormField = <
  FieldValue extends unknown,
  Props extends UseFinalFormReceivedProps<FieldValue> = {}
>(
  baseName: string,
  props: Props,
  inputConfig: InputHookConfig = {}
): UseFinalFormFieldValue<FieldValue> => {
  const sectionContext = React.useContext(FormSectionContext)
  const name = joinNames(sectionContext.name, baseName)

  const { input, meta } = useField<FieldValue>(name, props)

  const { disabled, required, label: rawLabel } = props

  const formStatus = React.useContext(FormContext)

  useFieldStatus({
    error: meta.error,
    dirty: meta.dirty,
    path: sectionContext.path,
    formStatus,
  })

  const error = meta.error ?? meta.submitError

  const label = useLabel({
    error,
    label: rawLabel,
    required,
    formStatus,
  })

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
        !every(input.value, e => includes(arrayLocalValue, e)) ||
        get(input.value, 'length') !== get(arrayLocalValue, 'length')
      ) {
        setLocalValue(input.value)
      }
    } else {
      setLocalValue(input.value)
    }
  }, [input.value]) // eslint-disable-line

  const handleChange = React.useCallback(
    newRawValue => {
      const newValue = newRawValue?.target
        ? newRawValue.target.value
        : newRawValue

      if (inputConfig.changeOnBlur) {
        setLocalValue(newValue)
      } else {
        input.onChange(newValue)
      }
    },
    [input, inputConfig]
  )
  const fieldShowError = isFunction(props.shouldShowError)
    ? !!props.shouldShowError(meta)
    : true

  const value = React.useMemo(() => {
    if (inputConfig.changeOnBlur) {
      return (localValue as any)?.target
        ? (localValue as any).target.value
        : localValue
    }

    return input.value
  }, [input.value, inputConfig.changeOnBlur, localValue])

  return {
    input,
    meta,
    label,
    onChange: handleChange,
    value,
    disabled: isNil(disabled) ? formStatus.disabled : disabled,
    showError: fieldShowError && formStatus.showErrors && !!error,
    error,
  }
}

export default useFinalFormField
