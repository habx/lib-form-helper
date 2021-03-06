import * as React from 'react'
import styled from 'styled-components'

import { Text, theme } from '@habx/ui-core'

import { FieldErrorBehavior } from '../useFinalFormField'

const FieldErrorContent = styled(Text)`
  color: ${theme.color('error')};
  padding-top: 8px;
  min-height: calc(1em + 8px);
  line-height: 1.2;
`

export const REQUIRED_FIELD_ERROR = 'REQUIRED_FIELD_ERROR'

export const FieldError: React.FunctionComponent<FieldErrorProps> = ({
  value,
  showError,
  errorBehavior,
}) => {
  if (errorBehavior === 'never') {
    return null
  }

  return (
    <FieldErrorContent type="caption">
      {showError ? value : null}
    </FieldErrorContent>
  )
}

interface FieldErrorProps {
  showError: boolean
  value: React.ReactNode
  errorBehavior: FieldErrorBehavior
}
