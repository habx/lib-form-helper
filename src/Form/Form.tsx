import * as React from 'react'
import { Form as FinalForm } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import { StatusContext } from '../contexts'

import FormProps, { FormContentProps } from './Form.interface'

const FormContext = React.createContext<any>({})

const FormContent: React.FunctionComponent<FormContentProps> = props => {
  const [sectionStatuses, setSectionStatuses] = React.useState({})
  const { render } = React.useContext(FormContext)

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
      {render(props)}
    </StatusContext.Provider>
  )
}

const Form: React.FunctionComponent<FormProps> = ({ disabled, render, ...props }) => (
  <FormContext.Provider value={{ render }}>
    <FinalForm
      {...props}
      mutators={arrayMutators as { [key: string]: any }}
      component={FormContent}
    />
  </FormContext.Provider>
)

Form.defaultProps = {
  disabled: false
}

export default Form
