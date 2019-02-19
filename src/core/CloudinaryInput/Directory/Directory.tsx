import * as React from 'react'
import { map, filter } from 'lodash'
import { Spinner, TextInput } from '@habx/lib-client-backoffx'
import * as habxFilter from '@habx/lib-client-backoffx/Spotlight/filter'

import Image from '../Image'

import DirectoryProps from './Directory.interface'
import { DirectoryContainer, ImageList, ImageContainer, QueryBar } from './Directory.style'

const Directory: React.FunctionComponent<DirectoryProps> = ({
  images,
  loading,
  selectedImage,
  onImageClick
}) => {
  const [query, setQuery] = React.useState('')
  const matchingImages = React.useMemo(
    () => filter(images, image => habxFilter.some('public_id')(query, image)),
    [query, images]
  )

  return (
    <DirectoryContainer data-loading={loading}>
      {
        loading
          ? <Spinner />
          : (
            <React.Fragment>
              <QueryBar>
                <TextInput placeholder='Filtrer' value={query} onChange={setQuery as (query: string) => void} />
              </QueryBar>
              <ImageList>
                {map(matchingImages, image => (
                  <ImageContainer key={image.public_id}>
                    <Image
                      size='thumbnail'
                      onClick={() => onImageClick(image)}
                      id={image.public_id}
                      data-fade={selectedImage && image.public_id !== selectedImage.public_id}
                    />
                  </ImageContainer>
                ))}
              </ImageList>
            </React.Fragment>
          )
      }
    </DirectoryContainer>
  )
}


export default Directory
