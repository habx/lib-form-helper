# lib-form-helper

Helpers and wrappers for React Final Form built with `@habx/ui-core`

___

## Components

### `Form: React.VoidFunctionComponent<HabxFormProps>`

The `Form` component is a wrapper around the `Form` component of `react-final-form`.
It allows advanced error and disabled management.

#### Example

```typescript jsx
import * as React from 'react'
import { Form, withFinalForm } from '@habx/lib-form-helper'
import { TextInput } from '@habx/ui-core'

const WrappedTextInput = withFinalForm()(TextInput)

export const MyForm = ({ onSubmit }) => (
  <Form
    initialValues={{ firstName: 'Victor', familyName: 'Hugo' }}
    onSubmit={onSubmit}
    render={(
      <React.Fragment>
        <WrappedTextInput name='firstName' />
        <WrappedTextInput name='familyName' />
      </React.Fragment>
    )}
  />
)
```

### `FormSection`

Component allowing you to build custom feedback for your errors.
Each `FormSection` is aware of the errors of the fields inside them.

#### Example

Change the style of your section if some fields inside it have an error (e.g: put the title of the card in red)

```typescript jsx
import * as React from 'react'
import { Form, FormSection, withFinalForm } from '@habx/lib-form-helper'
import { Card, TextInput } from '@habx/ui-core'

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

### `FormSectionWatcher`

Component allowing you to listen to your section state.

#### Example
Build a navigation panel for your sections

```typescript jsx
import * as React from 'react'
import { Form, FormSection, StatusContext, withFinalForm } from '@habx/lib-form-helper'
import { Card, TextInput, Title } from '@habx/ui-core'

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

const NavigationPanel = () => (
  <FormSectionWatcher id="basic-informations">
    {({ hasError }) => (
      <Title type="regular" error={hasError}>Basic Informations</Title>
    )}
  </FormSectionWatcher>
)

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

___

## Hooks

### `useFinalFormField`

Hook wrapping the `useField` hook of React Final Form
If allows advanced behaviors such as :

- Describes when to display the errors of on the field
- Automatically disable the field when the form is disabled
- Nested sections (see `FormSection`)
- Only update field value in form state on blur
- Set the field as `required`

We recommend to directly use `useFinalFormField` only when your use case is too specific for `withFinalFormField`
Most of the time, you should be able to build reusable wrappers with `withFinalForm`

#### Example

```typescript jsx
import { FormatterCallback, ParserCallback, FieldError, useFinalFormField } from '@habx/lib-form-helper'
import { Slider } from '@habx/ui-core'

export const surfaceFormat: FormatterCallback<number, number> = (value) =>
  value ? value / 10000 : value

export const surfaceParse: ParserCallback<number, number> = (value) =>
  value ? value * 10000 : value

export const MyField = () => {
  const {
    input,
    error,
    label,
    disabled,
    shouldDisplayInlineError,
    shouldBeInErrorMode,
    errorBehavior,
  } = useFinalFormField<number>(name, {
    label: "Garden surface",
    parse: surfaceParse,
    format: surfaceFormat,
  })
  
  return (
    <React.Fragment>
      <Slider {...input} error={shouldBeInErrorMode} />
      <FieldError
        showError={shouldDisplayInlineError}
        value={error}
        errorBehavior={errorBehavior}
      />
    </React.Fragment>
  )
}
```

### `useFormAutoSubmitDecorator`

Allow to submit the form whenever a field value changes
Handles debouncing of a list of fields.

#### Example

```typescript jsx
import * as React from 'react'
import { Form, useFormAutoSubmitDecorator } from '@habx/lib-form-helper'

import { EmailInput } from '@components/final-form/EmailInput'
import { Select } from '@components/final-form/Select'

export const MyForm = ({ onSubmit }) => {
  const autoSubmitDecorator = useFormAutoSubmitDecorator({
    debouncedFields: ['email']
  })
  
  return (
    <Form
      initialValues={{ email: '', role: 'user' }}
      decorators={[autoSubmitDecorator]}
      onSubmit={onSubmit}
      render={(
        <React.Fragment>
          <EmailInput name='email' required />
          <Select name='role' options={USER_ROLES} required />
        </React.Fragment>
      )}
    />
  )
}
```

### `useFormKeyboardSubmitDecorator`

Allow to submit the form by hitting <kbd>Ctrl</kbd> + <kbd>S</kbd> or <kbd>Cmd</kbd> + <kbd>S</kbd>

#### Example

```typescript jsx
import * as React from 'react'
import { Form, useFormAutoSubmitDecorator } from '@habx/lib-form-helper'

import { EmailInput } from '@components/final-form/EmailInput'

export const MyForm = ({ onSubmit }) => {
  const keyboardSubmitDecorator = useFormKeyboardSubmitDecorator()
  
  return (
    <Form
      decorators={[keyboardSubmitDecorator]}
      onSubmit={onSubmit}
      render={<EmailInput name='email' required />}
    />
  )
}
```

### `useFormattedNumber`

Hook to have a formatted string in the input, but a valid number in the form state

### Example

```typescript jsx
const InnerNumberInput = ({
  factor,
  onChange,
  value,
  ...props
}) => {
  const [formatted, handleChange] = useFormattedNumber({
    factor,
    intl: 'fr',
    onChange,
    value,
  })

  return (
    <TextInput
      {...props}
      value={formatted}
      onChange={(event) => handleChange(event.target.value)}
    />
  )
}

export const NumberInput = withFinalForm<number>()(InnerNumberInput)
```

___

## High Order Components

### `withFinalForm`

High Order Component internally calling `useFinalFormField` and allowing defining reusable fields with common validation and parsing / formatting.

#### Example: EmailInput

```typescript
import { withFinalForm, ValidationCallback } from '@habx/lib-form-helper'
import { TextInput } from '@habx/ui-core'

import { isEmail } from '@lib/validator'

const validate: ValidationCallback<string, any> = (
  email: string | undefined
) => {
  if (email && !isEmail(email)) {
    return 'Email non valide'
  }

  return undefined
}

export const EmailInput = withFinalForm<string>({
  validate,
  errorBehavior: 'dirty',
})(TextInput)
```

#### Example : SurfaceSlider

```typescript
import { FormatterCallback, ParserCallback, withFinalForm } from '@habx/lib-form-helper'
import { Slider } from '@habx/ui-core'

export const surfaceFormat: FormatterCallback<number, number> = (value) =>
  value ? value / 10000 : value

export const surfaceParse: ParserCallback<number, number> = (value) =>
  value ? value * 10000 : value

export const SurfaceSlider = withFinalForm<number>({
  parse: surfaceParse,
  format: surfaceFormat,
})(Slider)
``` 
