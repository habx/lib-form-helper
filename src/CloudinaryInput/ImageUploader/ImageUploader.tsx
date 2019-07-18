import { map, uniq, get, initial } from 'lodash'
import * as React from 'react'

import { FontIcon } from '@habx/thunder-ui'

import CloudinaryInputContext from '../CloudinaryInput.context'
import Directory from '../Directory'
import Header from '../Header'
import { CloudinaryImage, ACECloudinaryImage } from '../Image/Image.interface'
import ImageEditor from '../ImageEditor'

import ActionBar from './ActionBar'
import ImageUploaderProps, {
  ImageUploaderState,
} from './ImageUploader.interface'
import {
  Content,
  Directories,
  DirectoryLine,
  DirectoryContent,
} from './ImageUploader.style'
import { getTitle, getImageInOutputFormat } from './ImageUploader.utils'

const DEFAULT_DIRECTORIES = ['logos', 'cities', 'regions']

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_IMAGE': {
      return { ...state, selectedImage: action.value }
    }

    case 'SELECT_FIELD_IMAGE': {
      return {
        ...state,
        selectedImage: action.value,
        fieldImageConfig: action.value,
      }
    }

    case 'TOGGLE_IMAGE': {
      return {
        ...state,
        selectedImage:
          action.value === state.selectedImage ? null : action.value,
      }
    }

    case 'SET_IMAGE_LIST': {
      return { ...state, images: action.value.resources, imagesLoading: false }
    }

    case 'GO_TO_IMAGE_PAGE': {
      return { ...state, pageCursor: action.value }
    }

    case 'SET_IMAGE_LIST_LOADING': {
      return { ...state, imagesLoading: true }
    }

    case 'SET_IMAGE_CUSTOMIZATION': {
      return { ...state, customizedImage: action.value }
    }

    case 'GO_TO_DIRECTORY': {
      return { ...state, directory: action.value, pageCursor: '' }
    }

    default:
      throw new Error('Unknown action')
  }
}

const buildInitialState = ({ defaultDirectory }): ImageUploaderState => ({
  selectedImage: null as CloudinaryImage,
  fieldImageConfig: null as CloudinaryImage,
  customizedImage: null as ACECloudinaryImage,
  directory: defaultDirectory || 'cities',
  images: [],
})

const ImageUploader: React.FunctionComponent<ImageUploaderProps> = ({
  status,
  defaultDirectory,
  image,
  uploadImage,
  fetchImageConfig,
  onChange,
  renderImages,
}) => {
  const { setStatus, imageFormat } = React.useContext(CloudinaryInputContext)

  const [state, dispatch] = React.useReducer(
    reducer,
    buildInitialState({ defaultDirectory })
  )

  const handleImageUpload = React.useCallback(
    async event => {
      const file = Array.from(event.target.files)[0] as File

      const selectedImage = await uploadImage(file, {
        directory: state.directory,
      })

      dispatch({ type: 'SELECT_IMAGE', value: selectedImage })

      setStatus('customizer')
    },
    [setStatus, state.directory, uploadImage]
  )

  const handleImageToggle = React.useCallback(image => {
    dispatch({ type: 'TOGGLE_IMAGE', value: image })
  }, [])

  const handleImageCustomizationChange = React.useCallback(customizedImage => {
    dispatch({ type: 'SET_IMAGE_CUSTOMIZATION', value: customizedImage })
  }, [])

  const handleImageValidation = React.useCallback(
    ({ withCustomization }) => {
      const image = withCustomization
        ? state.customizedImage
        : {
            id: state.selectedImage.public_id,
            transforms: [],
            format: state.selectedImage.format === 'svg' ? 'svg' : 'auto',
          }

      const formattedImage = getImageInOutputFormat({ image, imageFormat })

      dispatch({ type: 'SELECT_IMAGE', value: null })

      onChange(formattedImage)
    },
    [imageFormat, onChange, state.customizedImage, state.selectedImage]
  )

  const directories = React.useMemo(
    () =>
      defaultDirectory
        ? uniq([defaultDirectory, ...DEFAULT_DIRECTORIES])
        : DEFAULT_DIRECTORIES,
    [defaultDirectory]
  )

  const title = React.useMemo(
    () =>
      getTitle({
        directory: state.directory,
        selectedImage: state.selectedImage,
        status,
      }),
    [state.directory, state.selectedImage, status]
  )

  React.useEffect(() => {
    const updateImage = async () => {
      if (image && image.id) {
        const directory = initial(
          image.id.split('/').filter(el => el !== '')
        ).join('/')

        if (directory) {
          dispatch({ type: 'GO_TO_DIRECTORY', value: directory })
        }

        const config = await fetchImageConfig(image.id)

        dispatch({ type: 'SELECT_FIELD_IMAGE', value: config })
      }
    }

    updateImage()
  }, [image]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <Header title={title} onUploadImages={handleImageUpload} />
      <Content data-status={status}>
        {status === 'home' && (
          <Directories>
            {map(directories, directory => (
              <DirectoryLine
                key={directory}
                onClick={() => {
                  setStatus('directory')
                  dispatch({ type: 'GO_TO_DIRECTORY', value: directory })
                }}
              >
                <FontIcon icon="folder" />
                <DirectoryContent>{directory}</DirectoryContent>
              </DirectoryLine>
            ))}
          </Directories>
        )}
        {status === 'directory' &&
          renderImages({
            directory: state.directory,
            pageCursor: state.pageCursor,
            render: ({ loading, data }) => {
              if (loading && !state.imagesLoading) {
                dispatch({ type: 'SET_IMAGE_LIST_LOADING' })
              }
              if (!loading && state.imagesLoading) {
                dispatch({ type: 'SET_IMAGE_LIST', value: data })
              }

              return (
                <Directory
                  images={get(data, 'resources')}
                  goToNextPage={
                    get(data, 'next_cursor')
                      ? () =>
                          dispatch({
                            type: 'GO_TO_IMAGE_PAGE',
                            value: get(data, 'next_cursor'),
                          })
                      : null
                  }
                  loading={loading}
                  selectedImage={state.selectedImage}
                  onImageClick={handleImageToggle}
                />
              )
            },
          })}
        {status === 'customizer' && state.selectedImage && (
          <ImageEditor
            image={state.selectedImage}
            onChange={handleImageCustomizationChange}
            initialTransforms={
              state.fieldImageConfig === state.selectedImage
                ? get(image, 'transforms')
                : null
            }
          />
        )}
      </Content>
      {state.selectedImage && <ActionBar onSelect={handleImageValidation} />}
    </React.Fragment>
  )
}

export default ImageUploader
