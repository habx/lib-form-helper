import { isNil, isFunction, omit } from 'lodash'
import * as React from 'react'
import { UseFieldConfig } from 'react-final-form'
import styled from 'styled-components'

import { Except } from '../_internal/typescript'
import useTranslate from '../_internal/useTranslate'
import { FormContext } from '../FormHelperProvider'
import useFinalFormField from '../useFinalFormField'

import {
  InputHOCConfig,
  FieldTransformationProps,
  FieldContentReceivedProps,
} from './withFinalForm.interface'

const FieldContainer = styled.div`
  padding: 8px 0;
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

    const t = useTranslate()
    const validate = React.useCallback(
      value => {
        const requiredValidatedValue =
          propsRef.current.required && (isNil(value) || value === '')
            ? `(${t('required')})`
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
      },
      [t]
    )

    React.useEffect(() => {
      propsRef.current = props
    })

    return { ...props, format, parse, validate }
  }

  const Field: React.FunctionComponent<FieldComponentProps> = props => {
    const fieldProps = useFieldProps(props)
    const {
      errors: { component: ErrorComponent, color: errorColor },
    } = React.useContext(FormContext)

    const { label, showError, meta, input, ...rest } = useFinalFormField<
      FieldValue
    >(props.name, fieldProps, hookConfig)

    return (
      <FieldContainer>
        <WrappedComponent
          {...(omit(props, [
            'format',
            'parse',
            'validate',
            'shouldShowError',
          ]) as Props)}
          {...input}
          {...rest}
          validate={inputConfig.isArray ? fieldProps.validate : undefined}
          error={showError}
          label={label}
          labelColor={showError ? errorColor : null}
        />
        {!label && (
          <ErrorComponent padding={inputConfig.errorPadding}>
            {showError && typeof meta.error !== 'object' && meta.error}
          </ErrorComponent>
        )}
      </FieldContainer>
    )
  }

  return Field
}

export default withFinalForm
