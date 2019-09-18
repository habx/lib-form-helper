import { get, isNil } from 'lodash'
import * as React from 'react'
import { useField } from 'react-final-form'

import useUniqID from '../_internal/useUniqID'
import { SectionContext, StatusContext } from '../contexts'
import { useTranslate } from '../Intl'
import joinNames from '../joinNames'

import {
  InputHookConfig,
  UseFinalFormFieldValue,
} from './useFinalFormField.interface'

const useFieldStatus = ({
  error,
  dirty,
  path,
  formStatus: { setFieldStatus },
}) => {
  const isFirst = React.useRef(true)
  const uniqID = useUniqID()

  React.useLayoutEffect(() => {
    if (!isFirst.current || error) {
      setFieldStatus(uniqID, path, 'error', error)
    }
  }, [error, path, setFieldStatus, uniqID])

  React.useLayoutEffect(() => {
    if (!isFirst.current || dirty) {
      setFieldStatus(uniqID, path, 'dirty', dirty)
    }
  }, [dirty, path, setFieldStatus, uniqID])

  React.useLayoutEffect(() => {
    isFirst.current = false

    return () => {
      setFieldStatus(uniqID, path, 'error', undefined)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

const useLabel = ({ error, required, label, formStatus }) => {
  const t = useTranslate()
  return React.useMemo(() => {
    if (!formStatus.showErrors) {
      return label
    }

    if (!label) {
      return null
    }

    if (!error || error === 'required') {
      return `${label}${required ? ` (${t('required')}` : ''}`
    }

    if (error && typeof error === 'object') {
      return label ? `${label} (${t('containsErrors')})` : t('containsErrors')
    }

    if (error && typeof error !== 'object') {
      return `${label} : ${error}`
    }
  }, [formStatus.showErrors, label, error, required, t])
}

const useFinalFormField = <FieldValue extends unknown>(
  baseName: string,
  props,
  inputConfig: InputHookConfig = {}
): UseFinalFormFieldValue<FieldValue> => {
  const sectionContext = React.useContext(SectionContext)
  const name = joinNames(sectionContext.name, baseName)

  const { input, meta } = useField<FieldValue>(name, props)

  const { disabled, required, label: rawLabel } = props

  const formStatus = React.useContext(StatusContext)

  useFieldStatus({
    error: meta.error,
    dirty: meta.dirty,
    path: sectionContext.path,
    formStatus,
  })

  const label = useLabel({
    error: meta.error,
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
    setLocalValue(input.value)
  }, [input.value])

  const handleChange = React.useCallback(
    newValue => {
      if (inputConfig.changeOnBlur) {
        setLocalValue(newValue)
      } else {
        input.onChange(newValue)
      }
    },
    [input, inputConfig.changeOnBlur]
  )

  return {
    input,
    meta,
    label,
    onChange: handleChange,
    value: inputConfig.changeOnBlur ? localValue : input.value,
    disabled: isNil(disabled) ? formStatus.disabled : disabled,
    showError:
      formStatus.showErrors && !!get(meta, 'error') && !!get(meta, 'touched'),
  }
}

export default useFinalFormField
