import { isFunction, isNil } from 'lodash'
import * as React from 'react'

import { FieldError } from '../FieldError'
import { REQUIRED_FIELD_ERROR } from '../FieldError/FieldError'
import { useFinalFormField } from '../useFinalFormField'
import { UseFinalFormFieldValue } from '../useFinalFormField/useFinalFormField.interface'
import { useTranslate } from '../useTranslate'

import {
  FieldReceivedProps,
  FieldTransformationProps,
  WithFinalFormOptions,
} from './withFinalForm.interface'

export const withFinalForm =
  <
    InputValue extends unknown,
    AdditionalProps extends object = {},
    Element extends HTMLElement = HTMLDivElement,
    FieldValue = any
  >(
    options: WithFinalFormOptions<InputValue, FieldValue> = {}
  ) =>
  <Props extends object>(WrappedComponent: React.ComponentType<Props>) => {
    type BaseProps = Omit<Props & AdditionalProps, 'value' | 'onChange'> &
      Omit<
        FieldReceivedProps<InputValue>,
        'value' | keyof FieldTransformationProps<any, any, any>
      >

    type ComponentProps = BaseProps &
      FieldTransformationProps<InputValue, FieldValue, BaseProps>

    return React.forwardRef<Element, ComponentProps>((props, ref) => {
      const fieldPropsRef = React.useRef<UseFinalFormFieldValue<FieldValue>>()
      const propsRef = React.useRef(props)
      const t = useTranslate()

      propsRef.current = props

      const format = React.useCallback((value: any) => {
        let result = value

        // The default format comes directly from [React Final Form](https://github.com/final-form/react-final-form/blob/464f1c7855e93899630df0ad897c322995601849/src/useField.js#L24).
        if (isFunction(options.format)) {
          result = options.format(value, propsRef.current)
        } else if (value === undefined) {
          result = ''
        }

        return isFunction(propsRef.current?.format)
          ? propsRef.current.format(result, propsRef.current)
          : result
      }, [])

      const parse = React.useCallback((value: any) => {
        let result = value

        /*
         * Overrides the default parse method in an attempt to mitigate [this issue](https://github.com/final-form/react-final-form/issues/130).
         * The idea is, to check when the input field is empty, whether an initial value was set:
         *   - in the absence of an initial value, we return `undefined` in order for Final Form to compute an accurate pristine state.
         *   - if a value was originally provided, we return the empty string. This is especially useful for tools that ignores `undefined` values while updating an existing state (e.g. `@apollo/client`).
         */
        if (isFunction(options.parse)) {
          result = options.parse(value, propsRef.current)
        } else if (value === '') {
          result = fieldPropsRef.current?.meta.initial && ''
        }

        return isFunction(propsRef.current?.parse)
          ? propsRef.current.parse(result, propsRef.current)
          : result
      }, [])

      const validate = React.useCallback<NonNullable<typeof options.validate>>(
        async (value, allValues, meta) => {
          let error: string | undefined

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

          if (!error && options.validate) {
            const componentError = await options.validate(
              value,
              allValues,
              meta,
              propsRef.current
            )

            if (componentError) {
              error = componentError
            }
          }

          if (!error && propsRef.current?.validate) {
            const instanceError = await propsRef.current.validate(
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

      const fieldProps = useFinalFormField<FieldValue>(
        props.name,
        {
          ...props,
          errorBehavior: props.errorBehavior ?? options.errorBehavior,
          format,
          parse,
          validate,
        },
        {
          changeOnBlur: options.changeOnBlur,
        }
      )

      fieldPropsRef.current = fieldProps

      const {
        error,
        errorBehavior,
        input,
        shouldBeInErrorMode,
        shouldDisplayInlineError,
        ...rest
      } = React.useMemo<UseFinalFormFieldValue<FieldValue>>(
        () => options.mapFieldValueToProps?.(fieldProps) ?? fieldProps,
        [fieldProps]
      )

      return (
        <div>
          <WrappedComponent
            ref={ref}
            {...(props as Props)}
            {...input}
            {...rest}
            error={shouldBeInErrorMode}
            validate={options.isArray ? validate : undefined}
          />

          <FieldError
            errorBehavior={errorBehavior}
            showError={shouldDisplayInlineError}
            value={error}
          />
        </div>
      )
    })
  }
