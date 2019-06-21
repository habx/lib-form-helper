import * as React from 'react'

import { TextArea } from '@habx/thunder-ui'

import withFinalForm from './withFinalForm'

export default withFinalForm

const Field = withFinalForm<number, {}>()(TextArea)

export const Test = () => (
  <Field
    name="testName"
    validate={(value, { rows }) => (Number.isNaN(rows) ? 'A' : 'B')}
  />
)
