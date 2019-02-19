import * as React from 'react'
import { map, filter, max } from 'lodash'
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
  const ref = React.useRef(null)
  const matchingImages = React.useMemo(
    () => filter(images, image => habxFilter.some('public_id')(query, image)),
    [query, images]
  )

  React.useLayoutEffect(() => {
    if (!loading && ref.current) {
      const selectedImageRef = ref.current.querySelector('*[data-selected="true"]')
      console.log(selectedImageRef.offsetTop - (ref.current.offsetHeight - selectedImageRef.offsetHeight) / 2)
      ref.current.scrollTop = max([
        selectedImageRef.offsetTop - (ref.current.offsetHeight - selectedImageRef.offsetHeight) / 2,
        0
      ])
    }

  }, [loading, matchingImages, ref])

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
              <ImageList ref={ref}>
                {map(matchingImages, image => (
                  <ImageContainer
                    key={image.public_id}
                    data-selected={selectedImage && image.public_id === selectedImage.public_id}
                  >
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
