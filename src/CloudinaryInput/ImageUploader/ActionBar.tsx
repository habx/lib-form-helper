import * as React from 'react'

import { TextButton } from '@habx/thunder-ui'

import { ActionBarProps } from './ImageUploader.interface'
import { ActionBarContainer } from './ImageUploader.style'

const ActionBar: React.FunctionComponent<ActionBarProps> = ({
  status,
  onSelect,
  onCustomize,
  onValidateCustomization,
  canCustomize,
}) => (
  <ActionBarContainer>
    {status === 'directory' && (
      <React.Fragment>
        <TextButton onClick={onSelect}>Sélectionner</TextButton>
        {canCustomize && (
          <TextButton onClick={onCustomize}>Personnaliser</TextButton>
        )}
      </React.Fragment>
    )}
    {status === 'customizer' && (
      <React.Fragment>
        <TextButton onClick={onValidateCustomization}>Enregistrer</TextButton>
      </React.Fragment>
    )}
  </ActionBarContainer>
)

export default ActionBar
