import { isFunction, isNil, omit } from 'lodash'
import * as React from 'react'
import { UseFieldConfig } from 'react-final-form'
import styled from 'styled-components'

import { Except } from '../_internal/typescript'
import useTranslate from '../_internal/useTranslate'
import { FormContext } from '../FormHelperProvider'
import useFinalFormField from '../useFinalFormField'

import {
  FieldContentReceivedProps,
  FieldTransformationProps,
  InputHOCConfig,
} from './withFinalForm.interface'

const FieldContainer = styled.div`
  &:not(:last-child) {
    padding-bottom: 12px;
  }
`

const withFinalForm = <
  FieldValue extends unknown,
  AdditionalProps extends object = {},
  Element extends HTMLElement = HTMLDivElement
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
        if (propsRef.current.required && (isNil(value) || value === '')) {
          return propsRef.current.label
            ? `(${t('errors.required.short')})`
            : t('errors.required.full')
        }

        const componentError =
          isFunction(inputConfig.validate) &&
          inputConfig.validate(value, propsRef.current)
        if (componentError) {
          return componentError
        }

        const instanceError =
          isFunction(propsRef.current.validate) &&
          propsRef.current.validate(value, propsRef.current)
        if (instanceError) {
          return instanceError
        }

        return undefined
      },
      [t]
    )

    React.useEffect(() => {
      propsRef.current = props
    })

    return { ...props, format, parse, validate }
  }

  return React.forwardRef<Element, FieldComponentProps>((props, ref) => {
    const fieldProps = useFieldProps(props)
    const {
      errors: { component: ErrorComponent, color: errorColor },
    } = React.useContext(FormContext)

    const { label, showError, error, input, ...rest } = useFinalFormField<
      FieldValue
    >(props.name, fieldProps, hookConfig)

    return (
      <FieldContainer>
        <WrappedComponent
          ref={ref}
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
            {showError && error}
          </ErrorComponent>
        )}
      </FieldContainer>
    )
  })
}

export default withFinalForm
