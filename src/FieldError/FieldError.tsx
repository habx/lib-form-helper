import * as React from 'react'
import styled from 'styled-components'

import { Text, theme } from '@habx/ui-core'

const FieldErrorContent = styled(Text)`
  color: ${theme.color('error')};
  padding-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: calc(1em + 8px);
`

export const REQUIRED_FIELD_ERROR = 'REQUIRED_FIELD_ERROR'

export const FieldError: React.FunctionComponent<FieldErrorProps> = ({
  value,
  showError,
}) => (
  <FieldErrorContent type="caption">
    {showError ? value : null}
  </FieldErrorContent>
)

interface FieldErrorProps {
  showError: boolean
  value: React.ReactNode
}
