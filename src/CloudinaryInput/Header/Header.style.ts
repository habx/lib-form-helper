import styled from 'styled-components'

import { theme } from '@habx/thunder-ui'

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 48px;

  height: 48px;
  padding: 0 16px;

  background-color: ${theme.get('primary')};
  color: ${theme.get('neutralLightest')};
`

export const Title = styled.div`
  margin-left: 24px;
  user-select: none;
  flex: 0 0 auto;
`

export const Uploader = styled.div`
  flex: 1 1 100%;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  & label {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: ${theme.get('neutralLightest')};
  }

  & input {
    display: none;
  }

  & i {
    margin-left: 8px;
  }
`
