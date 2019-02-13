import * as React from 'react'
import { TextButton } from '@habx/lib-client-backoffx'

import { ActionBarProps } from './ImageUploader.interface'
import { ActionBarContainer } from './ImageUploader.style'


const ActionBar: React.StatelessComponent<ActionBarProps> = ({ status, onSelect, onCustomize, onValidateCustomization, canCustomize }) => (
  <ActionBarContainer>
    {
      status === 'directory' && (
        <React.Fragment>
          <TextButton onClick={onSelect}>Sélectionner</TextButton>
          { canCustomize && <TextButton onClick={onCustomize}>Personnaliser</TextButton> }
        </React.Fragment>
      )
    }
    {
      status === 'customizer' && (
        <React.Fragment>
          <TextButton onClick={onValidateCustomization}>Valider</TextButton>
        </React.Fragment>
      )
    }
  </ActionBarContainer>
)

export default ActionBar
