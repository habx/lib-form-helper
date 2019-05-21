import styled from 'styled-components'

import { theme } from '@habx/thunder-ui'

export const Content = styled.div`
  flex: 1 1 100%;
  background-color: ${theme.get('neutralLighter')};
  position: relative;
  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: auto;

  &[data-page='customizer'] {
    overflow: hidden;
  }
`

export const Directories = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 32px 0;
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

export const DirectoryLine = styled.li`
  display: flex;
  align-items: center;

  height: 48px;
  line-height: 48px;
  padding: 0 16px;
  transition: background-color 150ms ease-in-out;
  cursor: pointer;
  color: ${theme.get('neutral')};

  &:hover {
    background-color: ${theme.get('neutralLighter')};
  }
`

export const DirectoryContent = styled.div`
  padding-left: 16px;
`

export const ActionBarContainer = styled.div`
  flex: 0 0 48px;
  background-color: ${theme.get('neutralLightest')};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 32px;

  > * {
    margin-left: 16px;
  }
`
