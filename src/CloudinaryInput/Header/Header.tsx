import * as React from 'react'

import { FontIcon } from '@habx/thunder-ui'

import CloudinaryInputContext from '../CloudinaryInput.context'

import HeaderProps from './Header.interface'
import { HeaderContainer, Title, Uploader } from './Header.style'

const Header: React.FunctionComponent<HeaderProps> = ({
  onUploadImages,
  title,
}) => {
  const { status, setStatus } = React.useContext(CloudinaryInputContext)

  return (
    <HeaderContainer>
      <FontIcon icon="home" onClick={() => setStatus('home')} />
      <Title>{title}</Title>
      {status === 'directory' && (
        <Uploader>
          <label htmlFor="cloudinary-uploader">
            Nouvelle image
            <FontIcon icon="add" />
          </label>
          <input
            type="file"
            id="cloudinary-uploader"
            accept="image/*"
            onChange={onUploadImages}
          />
        </Uploader>
      )}
    </HeaderContainer>
  )
}

export default Header
