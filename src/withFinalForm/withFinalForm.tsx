import { isFunction, isNil, omit } from 'lodash'
import * as React from 'react'
import { UseFieldConfig } from 'react-final-form'

import { FieldError } from '../FieldError'
import { REQUIRED_FIELD_ERROR } from '../FieldError/FieldError'
import { useFinalFormField } from '../useFinalFormField'
import { UseFinalFormFieldValue } from '../useFinalFormField/useFinalFormField.interface'
import { useTranslate } from '../useTranslate'

import {
  FieldContentReceivedProps,
  FieldTransformationProps,
  InputHOCConfig,
} from './withFinalForm.interface'

export const withFinalForm =
  <
    InputValue extends unknown,
    AdditionalProps extends object = {},
    Element extends HTMLElement = HTMLDivElement,
    FieldValue = any
  >(
    inputConfig: InputHOCConfig<FieldValue, any, InputValue> = {}
  ) =>
  <Props extends object>(WrappedComponent: React.ComponentType<Props>) => {
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
      errorBehavior: rawErrorBehavior,
      ...props
    }: FieldComponentProps) => {
      const t = useTranslate()
      const propsRef = React.useRef<BaseProps>(props as BaseProps)
      const callbackRef =
        React.useRef<FieldTransformationProps<InputValue, BaseProps>>()

      propsRef.current = props as BaseProps
      callbackRef.current = {
        format: rawFormat,
        parse: rawParse,
        validate: rawValidate,
      } as FieldTransformationProps<InputValue, BaseProps>

      const format = React.useCallback((value) => {
        // Default format method comes directly from [React Final Form](https://github.com/final-form/react-final-form/blob/464f1c7855e93899630df0ad897c322995601849/src/useField.js#L24)
        const fieldFormattedValue = isFunction(inputConfig.format)
          ? inputConfig.format(value, propsRef.current)
          : value === undefined
          ? ''
          : value

        return isFunction(callbackRef.current?.format)
          ? callbackRef.current!.format(fieldFormattedValue, propsRef.current)
          : fieldFormattedValue
      }, [])

      const parse = React.useCallback((value) => {
        // Default parse method tries to mitigate [this issue](https://github.com/final-form/react-final-form/issues/130)
        const fieldParsedValue = isFunction(inputConfig.parse)
          ? inputConfig.parse(value, propsRef.current)
          : value === ''
          ? propsRef.current.initialValue && ''
          : value

        return isFunction(callbackRef.current?.parse)
          ? callbackRef.current!.parse(fieldParsedValue, propsRef.current)
          : fieldParsedValue
      }, [])

      const validate = React.useCallback(
        async (value, allValues, meta) => {
          let error = undefined

          if (
            propsRef.current.required &&
            (isNil(value) ||
              value === '' ||
              (Array.isArray(value) && value.length === 0))
          ) {
            error = propsRef.current.label
              ? REQUIRED_FIELD_ERROR
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

          return error
        },
        [t]
      )

      const errorBehavior = rawErrorBehavior ?? inputConfig.errorBehavior

      return { ...props, format, parse, validate, errorBehavior }
    }

    return React.forwardRef<Element, FieldComponentProps>((props, ref) => {
      const fieldProps = useFieldProps(props)

      const fieldValue = useFinalFormField<InputValue>(
        props.name,
        fieldProps,
        hookConfig
      )

      const {
        label,
        shouldBeInErrorMode,
        shouldDisplayInlineError,
        error,
        errorBehavior,
        input,
        ...rest
      } = React.useMemo<UseFinalFormFieldValue<InputValue>>(
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
            error={shouldBeInErrorMode}
            label={label}
          />
          <FieldError
            showError={shouldDisplayInlineError}
            value={error}
            errorBehavior={errorBehavior}
          />
        </div>
      )
    })
  }
