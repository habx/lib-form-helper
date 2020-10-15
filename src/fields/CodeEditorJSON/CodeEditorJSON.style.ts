import styled from 'styled-components'

export const CodeEditorJSONContainer = styled.div`
  &[data-disabled='true'] {
    pointer-events: none;
    opacity: 0.8;
    filter: grayscale();
  }
`
