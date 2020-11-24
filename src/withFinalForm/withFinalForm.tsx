import { isFunction, isNil, omit } from 'lodash'
import * as React from 'react'
import { UseFieldConfig } from 'react-final-form'

import { isFunctionAsync } from '../_internal/isFunctionAsync'
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
  inputConfig: InputHOCConfig<FieldValue, any, InputValue> = {}
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
    const t = useTranslate()
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

    const asyncInstanceValidationRef = React.useRef<
      ((response: boolean) => void) | null
    >(null)

    const validate = React.useCallback(
      async (value, allValues, meta) => {
        let error: string | undefined = undefined

        if (
          propsRef.current.required &&
          (isNil(value) ||
            value === '' ||
            (Array.isArray(value) && value.length === 0))
        ) {
          error = propsRef.current.label
            ? `(${t('errors.required.short', {}, { upperFirst: false })})`
            : t('errors.required.full')
        }

        if (!error && inputConfig.validate) {
          const componentError = await inputConfig.validate(
            value,
            allValues,
            meta,
            propsRef.current
          )

          if (componentError) {
            error = componentError
          }
        }

        if (!error && callbackRef.current?.validate) {
          if (asyncInstanceValidationRef.current) {
            asyncInstanceValidationRef.current(false)
          }

          let shouldUseInstanceValidation: boolean
          if (isFunctionAsync(callbackRef.current.validate)) {
            const promise = new Promise<boolean>((resolve) => {
              asyncInstanceValidationRef.current = resolve
              setTimeout(() => resolve(true), 500)
            })

            shouldUseInstanceValidation = await promise
          } else {
            shouldUseInstanceValidation = true
          }

          if (shouldUseInstanceValidation) {
            const instanceError = await callbackRef.current.validate(
              value,
              allValues,
              meta,
              propsRef.current
            )

            if (instanceError) {
              error = instanceError
            }
          }
        }

        return error
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

    const fieldValue = useFinalFormField<InputValue>(
      props.name,
      fieldProps,
      hookConfig
    )

    const { label, showError, error, input, ...rest } = React.useMemo(
      () => inputConfig.mapFieldValueToProps?.(fieldValue) ?? fieldValue,
      [fieldValue]
    )

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
