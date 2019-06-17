import { get } from 'lodash'
import * as React from 'react'

import { withLabel, Button } from '@habx/thunder-ui'

import CloudinaryInputContext from './CloudinaryInput.context'
import CloudinaryInputProps, { statuses } from './CloudinaryInput.interface'
import {
  CloudinaryInputContainer,
  CloudinaryInputModal,
  PictureContainer,
  EmptyImage,
  ActionsBar,
} from './CloudinaryInput.style'
import { parseCloudinaryURL, getIdFromChunks } from './CloudinaryInput.utils'
import Image from './Image'
import { ACECloudinaryImage } from './Image/Image.interface'
import ImageUploader from './ImageUploader'

const CloudinaryInput: React.FunctionComponent<CloudinaryInputProps> = ({
  disabled,
  renderImages,
  defaultDirectory,
  imageFormat = 'ace',
  fetchImageConfig,
  uploadImage,
  onChange,
  value,
}) => {
  const [status, setStatus] = React.useState('closed' as statuses)

  const image: ACECloudinaryImage = React.useMemo(() => {
    if (imageFormat === 'ace') {
      const id = get(value, 'id', '') as string
      return {
        ...(value as ACECloudinaryImage),
        id: getIdFromChunks(id.split('/')),
      }
    }

    if (imageFormat === 'id') {
      const id = (value as string) || ''
      return {
        id: getIdFromChunks(id.split('/')),
        transforms: [],
      } as ACECloudinaryImage
    }
    return parseCloudinaryURL(value as string)
  }, [imageFormat, value])

  const hasImage = image && image.id

  const handleChange = image => {
    onChange(image)
    setStatus('closed')
  }

  const context = React.useMemo(() => ({ setStatus, status, imageFormat }), [
    imageFormat,
    status,
  ])

  return (
    <CloudinaryInputContext.Provider value={context}>
      <CloudinaryInputContainer>
        {hasImage ? (
          <PictureContainer>
            <Image
              size="thumbnail"
              id={get(image, 'id')}
              transforms={get(image, 'transforms')}
            />
          </PictureContainer>
        ) : (
          <EmptyImage />
        )}
        <ActionsBar>
          {hasImage && imageFormat !== 'id' && (
            <Button onClick={() => setStatus('customizer')} disabled={disabled}>
              Éditer
            </Button>
          )}
          {hasImage && (
            <Button
              warning
              reverse
              onClick={() => onChange(null)}
              disabled={disabled}
            >
              Supprimer
            </Button>
          )}
          <Button
            onClick={() => setStatus('directory')}
            disabled={disabled}
            reverse
          >
            Nouveau
          </Button>
        </ActionsBar>
        <CloudinaryInputModal
          open={status !== 'closed'}
          onClose={() => setStatus('closed')}
        >
          {modal =>
            modal.state !== 'closed' && (
              <ImageUploader
                status={status}
                onChange={handleChange}
                defaultDirectory={defaultDirectory}
                renderImages={renderImages}
                image={image}
                fetchImageConfig={fetchImageConfig}
                uploadImage={uploadImage}
              />
            )
          }
        </CloudinaryInputModal>
      </CloudinaryInputContainer>
    </CloudinaryInputContext.Provider>
  )
}

export default withLabel({ padding: 12 })(CloudinaryInput)
