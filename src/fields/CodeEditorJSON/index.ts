import * as React from 'react'

const BaseCodeEditorJSON = React.lazy(() => import('./CodeEditorJSON'))

export { CodeEditorJSONProps } from './CodeEditorJSON.interface'

export const CodeEditorJSON = React.memo(BaseCodeEditorJSON)
