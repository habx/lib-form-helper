import { isNil, isFunction, omit } from 'lodash'
import * as React from 'react'
import { UseFieldConfig } from 'react-final-form'
import styled from 'styled-components'

import { fontSizes, theme, useTheme } from '@habx/thunder-ui'

import { Except } from '../_internal/typescript'
import useFinalFormField from '../useFinalFormField'

import {
  InputHOCConfig,
  FieldTransformationProps,
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

const withFinalForm = <
  FieldValue extends unknown,
  AdditionalProps extends object = {}
>(
  inputConfig: InputHOCConfig<FieldValue, {}> = {}
) => <Props extends object>(WrappedComponent: React.ComponentType<Props>) => {
  type BaseProps = AdditionalProps &
    FieldContentReceivedProps &
    Except<Props, 'value' | 'onChange'> &
    Except<
      UseFieldConfig<FieldValue>,
      'value' | keyof FieldTransformationProps<any, any>
    >

  type FieldComponentProps = BaseProps &
    FieldTransformationProps<FieldValue, BaseProps>

  const hookConfig = {
    changeOnBlur: inputConfig.changeOnBlur,
  }

  const useFieldProps = (props: BaseProps) => {
    const propsRef: React.MutableRefObject<FieldComponentProps> = React.useRef(
      props
    )

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

    React.useEffect(() => {
      propsRef.current = props
    })

    return { ...props, format, parse, validate }
  }

  const Field: React.FunctionComponent<FieldComponentProps> = props => {
    const fieldProps = useFieldProps(props)
    const thunderTheme = useTheme()

    const { label, showError, meta, input, ...rest } = useFinalFormField<
      FieldValue
    >(props.name, fieldProps, hookConfig)

    return (
      <FieldContainer>
        <WrappedComponent
          {...omit(props, ['format', 'parse', 'validate']) as Props}
          {...input}
          {...rest}
          error={showError}
          label={label}
          labelColor={showError ? thunderTheme.error : null}
        />
        {!label && (
          <FieldError padding={inputConfig.errorPadding}>
            {showError && meta.error}
          </FieldError>
        )}
      </FieldContainer>
    )
  }

  return Field
}

export default withFinalForm
