import { IAceEditorProps } from 'react-ace'

import { WithLabel } from '@habx/ui-core'

import { ValidationCallback } from '../../withFinalForm'

export interface InnerCodeEditorJSONProps
  extends WithLabel<
    IAceEditorProps & {
      disabled?: boolean
    }
  > {}

export interface CodeEditorJSONProps extends InnerCodeEditorJSONProps {
  name: string
  validate?: ValidationCallback<string, any>
}
