import * as React from 'react'
import PropTypes from 'prop-types'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import { StatusContext } from '../contexts'

import FormProps, { FormContentProps } from './Form.interface'

const FormContent: React.FunctionComponent<FormContentProps> = ({ children, ...props }) => {
  const [sectionStatuses, setSectionStatuses] = React.useState({})

  const context = React.useMemo(
    () => ({
      setSectionStatus: (sectionName: string, status) => {
        setSectionStatuses(prevStatuses => ({
          ...prevStatuses,
          [sectionName]: status
        }))
      },
      disabled: props.submitting || props.disabled,
      sectionStatuses
    }),
    [setSectionStatuses, sectionStatuses, props.submitting, props.disabled]
  )

  return (
    <StatusContext.Provider value={context}>
      {children(props)}
    </StatusContext.Provider>
  )
}

const Form: React.FunctionComponent<FormProps> = ({ disabled, render, ...props }) => {
  return (
    <FinalForm
      {...props}
      mutators={arrayMutators as { [key: string]: any }}
      component={FormContent}
    >
      render
    </FinalForm>
  )
}

Form.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node,
  render: PropTypes.func
}

Form.defaultProps = {
  disabled: false
}

export default Form
