# lib-form-helper
Helpers for back-office forms

## API

The `Form` component is a wrapper around the `Form` component in `react-final-form`.
It allows the advanced error and disabled management.

#### `Form: React.ComponentType<HabxFormProps>`

```js
interface HabxFormProps extends FormProps {
  disabled?: boolean
  shouldShowErrors?: (props: FormRenderProps) => boolean
}
```

```js
import { Form } from '@habx/lib-form-helper'

const MyForm = () => (
  <Form
    initialValues={{ name: 'Victor', surname: 'Hugo' }}
    onSubmit={console.log}
    render={props: FieldRenderProps} => (
      <div>/* content of the form */</div>
    )}
  />
)
```


