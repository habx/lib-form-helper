import styled from 'styled-components'

import { theme, borderRadius } from '@habx/thunder-ui'

export const CloudinaryInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  & > button {
    align-self: center;
  }
`

export const PictureContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;

  & > img {
    max-width: 100%;
  }
`

export const EmptyImage = styled.div`
  height: 150px;
  margin-bottom: 16px;
  background-color: ${theme.get('neutralLighter')};
  border-radius: ${borderRadius.wide};
`

export const ActionsBar = styled.div`
  display: flex;
  justify-content: flex-end;

  > * {
    margin-left: 16px;
  }
`
