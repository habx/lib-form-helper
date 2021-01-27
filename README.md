# lib-form-helper
Helpers for back-office forms

## API


### `Form: React.ComponentType<HabxFormProps>`

The `Form` component is a wrapper around the `Form` component in `react-final-form`.
It allows the advanced error and disabled management.

#### Types :

```typescript
import { FormProps, FormRenderProps } from 'react-final-form'

interface HabxFormProps extends FormProps {
  disabled?: boolean
  shouldShowErrors?: (props: FormRenderProps) => boolean
}
```

#### Example :

```typescript jsx
import React, { Fragment } from 'react'
import { Form, withFinalForm } from '@habx/lib-form-helper'
import { TextInput } from '@habx/thunder-ui'

const WrappedTextInput = withFinalForm()(TextInput)

export const MyForm = ({ onSubmit }) => (
  <Form
    initialValues={{ firstName: 'Victor', familyName: 'Hugo' }}
    onSubmit={onSubmit}
    render={(
      <Fragment>
        <WrappedTextInput name='firstName' />
        <WrappedTextInput name='familyName' />
      </Fragment>
    )}
  />
)
```

### `withFinalForm: (inputConfig: InputConfig) => (WrappedComponent: React.ComponentType<P>) => React.ComponentType<HabxFieldProps | P>`

The `withFinalForm` High Order Component wraps your input inside a `Field` from `react-final-form` and connect it to our `Form` wrapper to allow the advanced error and disabled management.

#### Types :

```typescript jsx
import { FieldProps } from 'react-final-form'

type InputConfig = {
  validate?: (value: any, props: object) => string | undefined
  format?: (value: any, props: object) => any
  parse?: (value: any, props: object) => any
  changeOnBlur?: boolean
}


interface HabxFieldProps extends FieldProps {
  disabled: boolean
  labelColor?: string
}
```


#### Example
```typescript jsx
import { TextInput } from '@habx/thunder-ui'
import { withFinalForm } from '@habx/lib-form-helper'

const parse = value => {
  if (!value || isNaN(value) || value.endsWith('.')) {
    return value
  }

  return parseFloat(value)
}

const validate = value => {
  if (value && typeof value !== 'number') {
    return "Ce nombre d'est pas valide"
  }
}

export const NumberInput = withFinalForm({
  parse,
  validate
})(TextInput)
```


### `FormSection: React.ComponentType<FormSectionProps>`

The `FormSection` component is a primitive that allow you to build custom feedback for your errors.
Each `FormSection` is aware of the errors of the fields inside them.


#### Types :


```typescript jsx
import * as React from 'react'

export default interface FormSectionProps {
  name: string
  children?: React.ReactNode | ((status: FormSectionStatus) => JSX.Element)
}

export type FormSectionStatus = {
  hasError: boolean
}
```

#### Examples

1) **Basic :** Change the style of your visual section if some fields inside of it have an error (e.g: put the title of the card in red)

 
```typescript jsx
import * as React from 'react'
import { Form, FormSection, withFinalForm } from '@habx/lib-form-helper'
import { Card, TextInput } from '@habx/thunder-ui'

const WrappedTextInput = withFinalForm()(TextInput)

const FormCard = ({ name, title, children }) => (
  <FormSection>
    {({ hasError }) => (
      <Card error={hasError} title={title}>
        { children }
      </Card>
    )}
  </FormSection>
)

export const MyForm = ({ onSubmit }) => (
  <Form
    initialValues={{ firstName: 'Victor', familyName: 'Hugo' }}
    onSubmit={onSubmit}
    render={(
      <FormCard name='basic-informations' title='Basic Informations'>
        <WrappedTextInput name='firstName' />
        <WrappedTextInput name='familyName' />
      </FormCard>
    )}
  />
)
```

2) **Advanced :** Build a navigation panel for your sections

```typescript jsx
import * as React from 'react'
import { Form, FormSection, StatusContext, withFinalForm } from '@habx/lib-form-helper'
import { Card, TextInput, Title } from '@habx/thunder-ui'

const WrappedTextInput = withFinalForm()(TextInput)

const FormCard = ({ name, title, children }) => (
  <FormSection>
    {({ hasError }) => (
      <Card error={hasError} title={title}>
        { children }
      </Card>
    )}
  </FormSection>
)

const NavigationPanel = () => {
  const { sectionStatuses } = React.useContext(StatusContext)
  
  return (
    <Title 
      size={4} 
      error={sectionStatuses['basic-informations'].hasError}
    >
      Basic Informations
    </Title>
  )
}

export const MyForm = ({ onSubmit }) => (
  <Form
    initialValues={{ firstName: 'Victor', familyName: 'Hugo' }}
    onSubmit={onSubmit}
    render={(
      <React.Fragment>
        <NavigationPanel />
        <FormCard name='basic-informations' title='Basic Informations'>
          <WrappedTextInput name='firstName' />
          <WrappedTextInput name='familyName' />
        </FormCard>
      </React.Fragment>
    )}
  />
)
```


### `useActions: () => Actions`

Allow you to directly access some actions from your form in order to programmatically interact with it.

```typescript jsx
interface Actions {
  change: (name: string, value?: any) => void
}
```
