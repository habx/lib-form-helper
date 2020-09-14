import { isFunction, isNil, omit } from 'lodash'
import * as React from 'react'
import { UseFieldConfig } from 'react-final-form'

import { FormContext } from '../FormHelperProvider'
import useFinalFormField from '../useFinalFormField'
import useTranslate from '../useTranslate'

import {
  FieldContentReceivedProps,
  FieldTransformationProps,
  InputHOCConfig,
} from './withFinalForm.interface'

/**
 * Duplicate final-form default parse & format
 * https://github.com/final-form/react-final-form/blob/464f1c7855e93899630df0ad897c322995601849/src/useField.js#L24
 */
const defaultFormat = (value?: any) => (value === undefined ? '' : value)
const defaultParse = (value?: any) => (value === '' ? undefined : value)

const withFinalForm = <
  InputValue extends unknown,
  AdditionalProps extends object = {},
  Element extends HTMLElement = HTMLDivElement,
  FieldValue = any
>(
  inputConfig: InputHOCConfig<FieldValue, {}, InputValue> = {}
) => <Props extends object>(WrappedComponent: React.ComponentType<Props>) => {
  type BaseProps = AdditionalProps &
    FieldContentReceivedProps<InputValue> &
    Omit<Props, 'value' | 'onChange'> &
    Omit<
      UseFieldConfig<InputValue>,
      'value' | keyof FieldTransformationProps<any, any>
    >

  type FieldComponentProps = Omit<
    BaseProps,
    keyof FieldTransformationProps<InputValue, BaseProps>
  > &
    FieldTransformationProps<InputValue, BaseProps>

  const hookConfig = {
    changeOnBlur: inputConfig.changeOnBlur,
  }

  const useFieldProps = ({
    format: rawFormat,
    parse: rawParse,
    validate: rawValidate,
    ...props
  }: FieldComponentProps) => {
    const propsRef = React.useRef<BaseProps>(props as BaseProps)
    const callbackRef = React.useRef<
      FieldTransformationProps<InputValue, BaseProps>
    >()

    propsRef.current = props as BaseProps
    callbackRef.current = {
      format: rawFormat,
      parse: rawParse,
      validate: rawValidate,
    } as FieldTransformationProps<InputValue, BaseProps>

    const format = React.useCallback((value) => {
      const fieldFormattedValue = isFunction(inputConfig.format)
        ? inputConfig.format(value, propsRef.current)
        : defaultFormat(value)

      return isFunction(callbackRef.current?.format)
        ? callbackRef.current!.format(fieldFormattedValue, propsRef.current)
        : fieldFormattedValue
    }, [])

    const parse = React.useCallback((value) => {
      const fieldParsedValue = isFunction(inputConfig.parse)
        ? inputConfig.parse(value, propsRef.current)
        : defaultParse(value)

      return isFunction(callbackRef.current?.parse)
        ? callbackRef.current!.parse(fieldParsedValue, propsRef.current)
        : fieldParsedValue
    }, [])

    const t = useTranslate()
    const validate = React.useCallback(
      (value, allValues, meta) => {
        if (
          propsRef.current.required &&
          (isNil(value) ||
            value === '' ||
            (Array.isArray(value) && value.length === 0))
        ) {
          return propsRef.current.label
            ? `(${t('errors.required.short', {}, { upperFirst: false })})`
            : t('errors.required.full')
        }

        const componentError =
          isFunction(inputConfig.validate) &&
          inputConfig.validate(value, allValues, meta)

        if (componentError) {
          return componentError
        }

        const instanceError =
          isFunction(callbackRef.current?.validate) &&
          callbackRef.current?.validate?.(value, allValues, meta)

        if (instanceError) {
          return instanceError
        }

        return undefined
      },
      [t]
    )

    return { ...props, format, parse, validate }
  }

  return React.forwardRef<Element, FieldComponentProps>((props, ref) => {
    const fieldProps = useFieldProps(props)

    const {
      errors: { component: ErrorComponent, color: errorColor },
    } = React.useContext(FormContext)

    const { label, showError, error, input, ...rest } = useFinalFormField<
      InputValue
    >(props.name, fieldProps, hookConfig)

    return (
      <div>
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
      </div>
    )
  })
}

export default withFinalForm
