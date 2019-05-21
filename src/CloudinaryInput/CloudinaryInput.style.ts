import styled from 'styled-components'

import { theme, borderRadius, Modal } from '@habx/thunder-ui'

export const CloudinaryInputContainer = styled.div`
  display: flex;
  flex-direction: column;

  & > button {
    align-self: center;
  }
`

export const PictureContainer = styled.div`
  width: 300px;
  margin-bottom: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;

  & > img {
    width: 300px;
  }
`

export const EmptyImage = styled.div`
  height: 150px;
  margin-bottom: 24px;
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

export const CloudinaryInputModal = styled(Modal)`
  padding: 0;
  max-width: 1000px;
  width: 1000px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`
