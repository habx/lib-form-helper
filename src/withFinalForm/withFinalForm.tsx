import * as React from 'react'
import styled from 'styled-components'
import { Field } from 'react-final-form'
import { isNil, isFunction, isString, omit, get } from 'lodash'
import { colors, fontSizes } from '@habx/thunder-ui'

import { StatusContext, SectionContext } from '../contexts'

import { InputConfig, FieldWrapperProps, FieldContentProps } from './withFinalForm.interface'

const FieldContainer = styled.div`
  padding: 8px 0;
`

const FieldError = styled.div`
  color: ${colors.internationalOrange};
  height: 1rem;
  font-size: ${fontSizes.tiny};

  padding: ${({ padding }) => padding}px;
`

const INTERNAL_PROPS = [
  'format',
  'parse',
  'validate',
  'required',
  'name',
  'meta',
  'input',
  'innerName'
]

const withFinalForm = (inputConfig: InputConfig = {}) => (WrappedComponent: React.ComponentType<any>) => {
  class FieldContent extends React.Component<FieldContentProps> {
    static contextType = StatusContext

    static getDerivedStateFromProps (nextProps, prevState) {
      if (
        inputConfig.changeOnBlur &&
        nextProps.input.value !== prevState.fieldValue &&
        !nextProps.meta.active
      ) {
        return {
          tempValue: nextProps.input.value,
          fieldValue: nextProps.input.value
        }
      }

      return null
    }

    state = {
      tempValue: null,
      fieldValue: null
    }

    componentDidUpdate (prevProps, prevState) {
      const { meta, input, sectionContext, innerName } = this.props
      const { tempValue, fieldValue } = this.state

      if (
        inputConfig.changeOnBlur &&
        !meta.active &&
        (fieldValue !== tempValue || fieldValue !== prevState.fieldValue)
      ) {
        input.onChange(tempValue)
      }

      if (meta.error !== prevProps.meta.error) {
        sectionContext.setError(innerName, meta.error)
      }
    }

    handleChange = newValue => {
      const { changeOnBlur } = inputConfig
      const {
        input: { onChange }
      } = this.props

      if (changeOnBlur) {
        this.setState(() => ({ tempValue: newValue }))
      } else {
        onChange(newValue)
      }
    }

    generateLabel (meta) {
      const { label, required, sectionContext } = this.props
      const { error } = meta

      if (!sectionContext.showErrors) {
        return label
      }

      if (!label) {
        return null
      }

      if (!error || error === 'required') {
        return `${label}${required ? ' (obligatoire)' : ''}`
      }

      if (error) {
        return `${label} : ${error}`
      }
    }

    render () {
      const { input, meta, label, disabled, sectionContext } = this.props
      const { tempValue } = this.state
      const { errorPadding } = inputConfig

      const innerProps = omit(this.props, INTERNAL_PROPS)
      const showError = sectionContext.showErrors && !!get(meta, 'error')

      return (
        <FieldContainer>
          <WrappedComponent
            {...innerProps}
            {...input}
            error={showError}
            label={this.generateLabel(meta)}
            labelColor={showError && colors.internationalOrange}
            value={inputConfig.changeOnBlur ? tempValue : input.value}
            onChange={this.handleChange}
            disabled={isNil(disabled) ? this.context.disabled : disabled} // tslint:disable-line deprecation
          />
          {!label && (
            <FieldError padding={errorPadding}>
              {isString(meta.error) && sectionContext.showErrors && meta.error}
            </FieldError>
          )}
        </FieldContainer>
      )
    }
  }

  const FieldWrapper: React.FunctionComponent<FieldWrapperProps> = props => {
    const sectionContext = React.useContext(SectionContext)

    const format = value => {
      const fieldFormattedValue = isFunction(inputConfig.format)
        ? inputConfig.format(value, props)
        : value

      return isFunction(props.format)
        ? props.format(fieldFormattedValue, props)
        : fieldFormattedValue
    }

    const parse = value => {
      const fieldParsedValue = isFunction(inputConfig.parse)
        ? inputConfig.parse(value, props)
        : value

      return isFunction(props.parse)
        ? props.parse(fieldParsedValue, props)
        : fieldParsedValue
    }

    const validate = value => {
      const { required } = props

      const requiredValidatedValue =
        required && (isNil(value) || value === '') ? 'required' : undefined

      const fieldValidatedValue =
        requiredValidatedValue ||
        (isFunction(inputConfig.validate) &&
          inputConfig.validate(value, props))

      if (fieldValidatedValue) {
        return fieldValidatedValue
      }

      return isFunction(props.validate)
        ? props.validate(value, props)
        : undefined
    }

    return (
      <Field
        {...props}
        innerName={props.name}
        format={format}
        parse={parse}
        validate={validate}
        component={FieldContent}
        sectionContext={sectionContext}
      />
    )
  }

  return FieldWrapper
}

export default withFinalForm
