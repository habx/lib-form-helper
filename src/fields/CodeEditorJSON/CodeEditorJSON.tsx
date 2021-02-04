import * as React from 'react'
import AceEditor from 'react-ace'

import { withLabel } from '@habx/ui-core'

import { useUniqID } from '../../_internal/useUniqID'
import { FieldError } from '../../FieldError'
import { useFinalFormField } from '../../useFinalFormField'
import { ValidationCallback } from '../../withFinalForm'

import {
  CodeEditorJSONProps,
  InnerCodeEditorJSONProps,
} from './CodeEditorJSON.interface'
import { CodeEditorJSONContainer } from './CodeEditorJSON.style'

import 'brace'
import 'brace/mode/javascript'
import 'brace/theme/github'

const isJSONValid = (value: string): boolean => {
  if (!value) {
    return false
  }
  try {
    JSON.parse(value)
    return true
  } catch (err) {
    return false
  }
}

const InnerCodeEditorJSON = withLabel()<InnerCodeEditorJSONProps>(
  ({ disabled, ...props }) => {
    const editorId = useUniqID()

    return (
      <CodeEditorJSONContainer data-disabled={disabled}>
        <AceEditor
          name={`ace-editor-${editorId}`}
          mode="javascript"
          theme="github"
          fontSize={16}
          width={''}
          editorProps={{ $blockScrolling: true }}
          tabSize={4}
          showPrintMargin={false}
          {...props}
        />
      </CodeEditorJSONContainer>
    )
  }
)

const CodeEditorJSON: React.FunctionComponent<CodeEditorJSONProps> = ({
  name,
  validate,
  label: rawLabel,
  ...props
}) => {
  const [localValue, setLocalValue] = React.useState<{
    value: string | null
    isValid: boolean
  }>({
    value: null,
    isValid: true,
  })

  const isValidRef = React.useRef(localValue.isValid)
  isValidRef.current = localValue.isValid

  const localValidate = React.useCallback<ValidationCallback<string, any>>(
    (...params) =>
      !isValidRef.current ? 'JSON non valide' : validate && validate(...params),
    [validate]
  )

  const {
    input,
    error,
    label,
    shouldDisplayInlineError,
    shouldBeInErrorMode,
  } = useFinalFormField<string | null>(name, {
    label: rawLabel,
    validate: localValidate,
    parse: (value: string) => {
      if (!value) {
        return undefined
      }

      try {
        return JSON.parse(value)
      } catch (e) {
        return {}
      }
    },
    format: (value: object) => {
      if (!value) {
        return ''
      }

      return JSON.stringify(value, undefined, 2)
    },
  })

  const handleChange = (newValue: string) =>
    setLocalValue({ value: newValue, isValid: isJSONValid(newValue) })

  React.useLayoutEffect(() => {
    setLocalValue({
      value: input.value,
      isValid: true,
    })
  }, [input.value])

  React.useLayoutEffect(() => {
    if (localValue.isValid) {
      input.onChange(localValue.value)
    } else {
      input.onChange(input.value)
    }
  }, [localValue.value, localValue.isValid]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <InnerCodeEditorJSON
        value={localValue.value ?? ''}
        onChange={handleChange}
        label={label}
        error={shouldBeInErrorMode}
        {...props}
      />
      <FieldError showError={shouldDisplayInlineError} value={error} />
    </div>
  )
}

export default CodeEditorJSON
