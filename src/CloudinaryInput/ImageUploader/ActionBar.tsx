import * as React from 'react'

import { TextButton } from '@habx/thunder-ui'

import CloudinaryInputContext from '../CloudinaryInput.context'

import { ActionBarProps } from './ImageUploader.interface'
import { ActionBarContainer } from './ImageUploader.style'

const ActionBar: React.FunctionComponent<ActionBarProps> = ({ onSelect }) => {
  const { setStatus, status, imageFormat } = React.useContext(
    CloudinaryInputContext
  )

  return (
    <ActionBarContainer>
      {status === 'directory' && (
        <React.Fragment>
          <TextButton onClick={() => onSelect({ withCustomization: false })}>
            Sélectionner
          </TextButton>
          {imageFormat !== 'id' && (
            <TextButton onClick={() => setStatus('customizer')}>
              Personnaliser
            </TextButton>
          )}
        </React.Fragment>
      )}
      {status === 'customizer' && (
        <React.Fragment>
          <TextButton onClick={() => onSelect({ withCustomization: true })}>
            Enregistrer
          </TextButton>
        </React.Fragment>
      )}
    </ActionBarContainer>
  )
}

export default ActionBar
