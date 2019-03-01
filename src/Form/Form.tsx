import * as React from 'react'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isFunction } from 'lodash'

import { StatusContext } from '../contexts'

import FormProps, { FormContentProps } from './Form.interface'

const FormContent: React.FunctionComponent<FormContentProps> = ({ render, form, shouldShowErrors, ...props }) => {
  const [sectionStatuses, setSectionStatuses] = React.useState({})
  const actions = React.useRef({
    change: (name: string, value?: any) => null
  })

  React.useEffect(() => {
    actions.current.change = form.change
  }, [form])

  const showErrors = isFunction(shouldShowErrors)
    ? shouldShowErrors({ form, ...props })
    : true

  const context = React.useMemo(
    () => ({
      setSectionStatus: (sectionName: string, status) => {
        setSectionStatuses(prevStatuses => ({
          ...prevStatuses,
          [sectionName]: status
        }))
      },
      disabled: props.submitting || props.disabled,
      sectionStatuses,
      actions: actions.current,
      showErrors
    }),
    [sectionStatuses, props.submitting, props.disabled, showErrors]
  )

  return (
    <StatusContext.Provider value={context}>
      {render({ ...props, form })}
    </StatusContext.Provider>
  )
}

const Form: React.FunctionComponent<FormProps> = ({ disabled, render, ...props }) => (
  <FinalForm
    {...props}
    mutators={arrayMutators as { [key: string]: any }}
    render={props => <FormContent {...props} render={render} disabled={disabled} />}
  />
)

Form.defaultProps = {
  disabled: false
}

export default Form
