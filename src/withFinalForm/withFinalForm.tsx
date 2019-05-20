import { isNil, isFunction, isString, get } from 'lodash'
import * as React from 'react'
import { Field } from 'react-final-form'
import styled from 'styled-components'

import { fontSizes, theme, useTheme } from '@habx/thunder-ui'

import useUniqID from '../_internal/useUniqID'
import { StatusContext, SectionContext, ErrorContext } from '../contexts'
import joinNames from '../joinNames'

import {
  InputConfig,
  FieldWrapperReceivedProps,
  FieldContentReceivedProps,
} from './withFinalForm.interface'

const FieldContainer = styled.div`
  padding: 8px 0;
`

const FieldError = styled.div`
  color: ${theme.get('error')};
  height: 1rem;
  font-size: ${fontSizes.tiny};

  padding: ${({ padding }) => padding}px;
`

const useFieldError = ({ error, path }) => {
  const isFirst = React.useRef(true)
  const uniqID = useUniqID()
  const errorContext = React.useContext(ErrorContext)

  React.useLayoutEffect(() => {
    if (!isFirst.current || error) {
      errorContext.setFieldError(uniqID, path, error)
    }
    isFirst.current = false
  }, [error, errorContext, path, uniqID])

  React.useLayoutEffect(() => {
    return () => {
      errorContext.setFieldError(uniqID, path, undefined)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

const withFinalForm = (inputConfig: InputConfig = {}) => <Props extends object>(
  WrappedComponent: React.ComponentType<Props>
) => {
  const FieldContent: React.FunctionComponent<
    Props & FieldContentReceivedProps
  > = props => {
    const {
      input,
      meta,
      disabled,
      formDisabled,
      showErrors,
      required,
      sectionContext,
      innerName,
      label: rawLabel,
      input: { value, onChange },
      ...rest
    } = props as FieldContentReceivedProps

    useFieldError({ error: meta.error, path: sectionContext.path })

    const [localValue, setLocalValue] = React.useState(value)
    const thunderTheme = useTheme()

    const showError = showErrors && !!get(meta, 'error')

    React.useEffect(() => {
      if (inputConfig.changeOnBlur && !meta.active && localValue !== value) {
        onChange(localValue)
      }
    }, [meta.active]) // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
      setLocalValue(value)
    }, [value])

    const handleChange = React.useCallback(
      newValue => {
        if (inputConfig.changeOnBlur) {
          setLocalValue(newValue)
        } else {
          onChange(newValue)
        }
      },
      [onChange]
    )

    const label = React.useMemo(() => {
      if (!showErrors) {
        return rawLabel
      }

      if (!rawLabel) {
        return null
      }

      if (!meta.error || meta.error === 'required') {
        return `${rawLabel}${required ? ' (obligatoire)' : ''}`
      }

      if (meta.error && typeof meta.error === 'object') {
        return rawLabel
          ? `${rawLabel} (contient des erreurs)`
          : 'Contient des erreurs'
      }

      if (meta.error && typeof meta.error !== 'object') {
        return `${rawLabel} : ${meta.error}`
      }
    }, [meta.error, rawLabel, required, showErrors])

    return (
      <FieldContainer>
        <WrappedComponent
          {...rest as Props}
          {...input}
          error={showError}
          label={label}
          labelColor={showError ? thunderTheme.error : null}
          value={inputConfig.changeOnBlur ? localValue : value}
          onChange={handleChange}
          disabled={isNil(disabled) ? formDisabled : disabled}
        />
        {!label && (
          <FieldError padding={inputConfig.errorPadding}>
            {isString(meta.error) && showErrors && meta.error}
          </FieldError>
        )}
      </FieldContainer>
    )
  }

  const FieldWrapper: React.FunctionComponent<
    Props & FieldWrapperReceivedProps
  > = props => {
    const sectionContext = React.useContext(SectionContext)
    const formStatus = React.useContext(StatusContext)
    const propsRef = React.useRef(props)

    React.useEffect(() => {
      propsRef.current = props
    })

    const format = React.useCallback(value => {
      const fieldFormattedValue = isFunction(inputConfig.format)
        ? inputConfig.format(value, propsRef.current)
        : value

      return isFunction(propsRef.current.format)
        ? propsRef.current.format(fieldFormattedValue, propsRef.current)
        : fieldFormattedValue
    }, [])

    const parse = React.useCallback(value => {
      const fieldParsedValue = isFunction(inputConfig.parse)
        ? inputConfig.parse(value, propsRef.current)
        : value

      return isFunction(propsRef.current.parse)
        ? propsRef.current.parse(fieldParsedValue, propsRef.current)
        : fieldParsedValue
    }, [])

    const validate = React.useCallback(value => {
      const requiredValidatedValue =
        propsRef.current.required && (isNil(value) || value === '')
          ? 'required'
          : undefined

      const fieldValidatedValue =
        requiredValidatedValue ||
        (isFunction(inputConfig.validate) &&
          inputConfig.validate(value, propsRef.current))

      if (fieldValidatedValue) {
        return fieldValidatedValue
      }

      return isFunction(propsRef.current.validate)
        ? propsRef.current.validate(value, propsRef.current)
        : undefined
    }, [])

    const name = joinNames(sectionContext.name, props.name)

    return (
      <Field
        {...props}
        name={name}
        innerName={name}
        format={format}
        parse={parse}
        validate={validate}
        formDisabled={formStatus.disabled}
        showErrors={formStatus.showErrors}
        component={FieldContent}
        sectionContext={sectionContext}
      />
    )
  }

  return FieldWrapper
}

export default withFinalForm
