import styled from 'styled-components'

import { theme } from '@habx/ui-core'

export const FieldError = styled.div<{
  padding?: number
}>`
  color: ${theme.color('error')};
  height: 1rem;
  font-size: 10px;
  padding: ${({ padding }) => `${padding ?? 0}px 0`};
`
