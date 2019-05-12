import { map, filter, max, find } from 'lodash'
import * as React from 'react'

import { Spinner, TextInput } from '@habx/thunder-ui'
import * as habxFilter from '@habx/thunder-ui/Spotlight/filter'

import Image from '../Image'

import DirectoryProps from './Directory.interface'
import {
  DirectoryContainer,
  ImageList,
  ImageContainer,
  QueryBar,
} from './Directory.style'

const Directory: React.FunctionComponent<DirectoryProps> = ({
  images,
  loading,
  selectedImage,
  onImageClick,
}) => {
  const [query, setQuery] = React.useState('')
  const ref = React.useRef(null)
  const matchingImages = React.useMemo(
    () => filter(images, image => habxFilter.some('public_id')(query, image)),
    [query, images]
  )

  const matchingImage = React.useMemo(
    () =>
      selectedImage
        ? find(
            matchingImages,
            image => image.public_id === selectedImage.public_id
          )
        : null,
    [selectedImage, matchingImages]
  )

  React.useLayoutEffect(() => {
    if (!loading && ref.current) {
      const selectedImageRef = ref.current.querySelector(
        '*[data-selected="true"]'
      )

      if (selectedImageRef) {
        ref.current.scrollTop = max([
          selectedImageRef.offsetTop -
            (ref.current.offsetHeight - selectedImageRef.offsetHeight) / 2,
          0,
        ])
      }
    }
  }, [loading, matchingImages, ref])

  return (
    <DirectoryContainer data-loading={loading}>
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <QueryBar>
            <TextInput
              placeholder="Filtrer"
              value={query}
              onChange={setQuery as (query: string) => void}
            />
          </QueryBar>
          <ImageList ref={ref}>
            {map(matchingImages, image => (
              <ImageContainer
                key={image.public_id}
                data-selected={image === matchingImage}
              >
                <Image
                  size="thumbnail"
                  onClick={() => onImageClick(image)}
                  id={image.public_id}
                  data-fade={selectedImage && image !== matchingImage}
                />
              </ImageContainer>
            ))}
          </ImageList>
        </React.Fragment>
      )}
    </DirectoryContainer>
  )
}

export default Directory
