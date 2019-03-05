# lib-form-helper
Helpers for back-office forms

## API


#### `Form: React.ComponentType<HabxFormProps>`

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
import { Form } from '@habx/lib-form-helper'

import { TextInput } from './my-fields-wrapped-with-final-form'

const MyForm = ({ onSubmit }) => (
  <Form
    initialValues={{ firstName: 'Victor', familyName: 'Hugo' }}
    onSubmit={onSubmit}
    render={(
      <Fragment>
        <TextInput name='firstName' />
        <TextInput name='familyName' />
      </Fragment>
    )}
  />
)
```


### FormSection

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
These component is currently used in two ways : 


1) Change the style of your visual section if some fields inside of it have an error (e.g: put the title of the card in red)

 
```typescript jsx
import * as React from 'react'
import { FomSection } from '@habx/lib-form-helper'
import { Card } from '@habx/thunder-ui'

import { TextInput } from './my-fields-wrapped-with-final-form'

const FormCard = ({ name, title, children }) => (
  <FormSection>
    {({ hasError }) => (
      <Card error={hasError} title={title}>
        { children }
      </Card>
    )}
  </FormSection>
)

const MyForm = ({ onSubmit }) => (
  <Form
    initialValues={{ firstName: 'Victor', familyName: 'Hugo' }}
    onSubmit={onSubmit}
    render={(
      <FormCard name='basic-informations' title='Basic Informations'>
        <TextInput name='firstName' />
        <TextInput name='familyName' />
      </FormCard>
    )}
  />
)
```

2) Build navigation panel for your sections

```typescript jsx

```
