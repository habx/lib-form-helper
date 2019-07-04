import styled from 'styled-components'

import { shadows, TextInput } from '@habx/thunder-ui'

export const DirectoryContainer = styled.div`
  position: relative;
  margin: 32px 0;
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;

  &[data-loading='true'] {
    align-items: center;
    justify-content: center;
  }
`

export const QueryBar = styled.div`
  padding: 0 32px 8px 32px;
  display: flex;
  align-items: center;

  & > button {
    margin-left: 24px;
  }
`

export const QueryInput = styled(TextInput)`
  flex: 1 1 auto;
`

export const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 100%;
  overflow: auto;
`

export const ImageContainer = styled.div`
  flex: 0 0 33%;
  box-sizing: border-box;
  padding: 16px;

  img {
    width: 100%;
    transition: box-shadow, opacity 150ms ease-in-out;
    cursor: pointer;

    &:hover {
      box-shadow: ${shadows.strong};
    }

    &[data-fade='true'] {
      opacity: 0.5;
      filter: grayscale();
    }
  }
`
