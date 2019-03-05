# lib-form-helper
Helpers for back-office forms

## Create a Form

```js
import { Form } from '@habx/lib-form-helper'

const MyForm = () => (
  <Form
    initialValues={{ name: 'Victor', surname: 'Hugo' }}
    onSubmit={console.log}
    render={({ form, values, handleSubmit, /* all final form props */}) => (
      <div>/* content of the form */</div>
    )}
  />
)
```
