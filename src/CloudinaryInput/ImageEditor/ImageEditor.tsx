import { filter, floor, get, find, values } from 'lodash'
import * as React from 'react'

import { Spinner, FontIcon, Button } from '@habx/thunder-ui'

import { createCloudinaryURL } from '../CloudinaryInput.utils'
import Image from '../Image'

import ImageEditorProps, {
  ImageEditorState,
  CropConfiguration,
} from './ImageEditor.interface'
import {
  ImageEditorContainer,
  ImageContainer,
  OptionsContainer,
  OptionContainer,
  OptionContent,
  OptionActions,
  Slider,
  ImageCroper,
  SpinnerContainer,
} from './ImageEditor.style'

const getImageMaxWidth = (image, transformation) => {
  const factor = get(transformation, 'width', 1)
  return floor(image.width * (factor > 1 ? factor / image.width : factor))
}

const getCropTransform = transforms => {
  const matchingTransform = find(transforms, el => get(el, 'crop') === 'crop')

  if (matchingTransform) {
    return {
      ...matchingTransform,
      width: parseFloat(get(matchingTransform, 'width', 1)),
      height: parseFloat(get(matchingTransform, 'height', 1)),
      x: parseFloat(get(matchingTransform, 'x', 0)),
      y: parseFloat(get(matchingTransform, 'y', 0)),
    }
  }
}

const getInitialState = ({ initialTransforms, image }): ImageEditorState => {
  const cropTransform = getCropTransform(initialTransforms)
  const dimensionTransform = find(
    initialTransforms,
    el => get(el, 'crop') === 'scale' && el.width
  )

  return {
    currentAction: null,
    crop: null,
    transformations: {
      crop: cropTransform,
      dimensions: dimensionTransform || {
        width: Math.min(getImageMaxWidth(image, cropTransform), 1000),
        crop: 'scale',
      },
    },
    transformationsBackup: null,
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_ACTION': {
      return {
        ...state,
        currentAction: action.value,
        transformationsBackup: state.transformations,
      }
    }

    case 'CANCEL_CURRENT_ACTION': {
      return {
        ...state,
        currentAction: null,
        transformations: state.transformationsBackup,
        transformationsBackup: null,
      }
    }

    case 'UPDATE_CROP_VALUE': {
      const {
        value: { width, height, x, y },
        imageDimensions,
      } = action

      const isValidCrop =
        (width !== 100 || height !== 100) && (width !== 0 || height !== 0)

      const transformationCrop = isValidCrop
        ? {
            crop: 'crop',
            width: width / imageDimensions.width,
            height: height / imageDimensions.height,
            x: x / imageDimensions.width,
            y: y / imageDimensions.height,
          }
        : null

      return {
        ...state,
        crop: action.value,
        transformations: { ...state.transformations, crop: transformationCrop },
      }
    }

    case 'UPDATE_DIMENSIONS_VALUE': {
      return {
        ...state,
        transformations: {
          ...state.transformations,
          dimensions: { crop: 'scale', width: action.value },
        },
      }
    }

    default: {
      throw new Error('Unknown action')
    }
  }
}

const ImageEditor: React.FunctionComponent<ImageEditorProps> = ({
  image,
  initialTransforms,
  onChange,
}) => {
  const imageCropRef = React.useRef(null)

  const [state, dispatch] = React.useReducer(
    reducer,
    getInitialState({ image, initialTransforms })
  )

  const handleCurrentActionChange = action => {
    dispatch({ type: 'SET_CURRENT_ACTION', value: action })
  }

  const handleCurrentActionValidation = () => {
    dispatch({ type: 'SET_CURRENT_ACTION', value: null })
  }

  const handleCurrentActionCancel = () => {
    dispatch({ type: 'CANCEL_CURRENT_ACTION' })
  }

  const handleCropChange = React.useCallback((crop: CropConfiguration) => {
    const node = get(imageCropRef, 'current.imageRef')

    if (node) {
      const imageDimensions = {
        width: node.naturalWidth,
        height: node.naturalHeight,
      }
      dispatch({ type: 'UPDATE_CROP_VALUE', value: crop, imageDimensions })
    }
  }, [])

  const handleDimensionsChange = React.useCallback(
    width => dispatch({ type: 'UPDATE_DIMENSIONS_VALUE', value: width }),
    []
  )

  React.useEffect(() => {
    onChange({
      id: image.public_id,
      transforms: values(state.transformations),
      format: image.format === 'svg' ? 'svg' : 'auto',
    })
  }, [state.currentAction]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!image) {
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    )
  }

  const transformationsToApply = filter(
    state.transformations,
    (value, key) => key !== state.currentAction
  )

  const sliderMaxWidth = getImageMaxWidth(image, state.transformations.crop)
  const sliderValue = get(
    state,
    'transformations.dimensions.width',
    Math.min(sliderMaxWidth, 1000)
  )

  return (
    <ImageEditorContainer>
      <ImageContainer>
        {state.currentAction === 'crop' ? (
          <ImageCroper
            src={createCloudinaryURL({
              id: image.public_id,
              transforms: transformationsToApply,
            })}
            onChange={handleCropChange}
            crop={state.crop}
            ref={imageCropRef}
          />
        ) : (
          <Image
            id={image.public_id}
            size="full"
            transforms={transformationsToApply}
          />
        )}
      </ImageContainer>
      {!state.currentAction && (
        <OptionsContainer>
          <Button
            onClick={() => handleCurrentActionChange('crop')}
            iconLeft={<FontIcon icon="crop" />}
            reverse
          >
            Cropper
          </Button>
          <Button
            onClick={() => handleCurrentActionChange('dimensions')}
            iconLeft={<FontIcon icon="photo_size_select_large" />}
            reverse
          >
            Redimensionner
          </Button>
        </OptionsContainer>
      )}
      {state.currentAction && (
        <OptionContainer>
          <OptionContent>
            {state.currentAction === 'crop' && 'Sélectionnez la zone à garder'}
            {state.currentAction === 'dimensions' && (
              <Slider
                value={sliderValue}
                max={sliderMaxWidth}
                onChange={handleDimensionsChange}
              />
            )}
          </OptionContent>
          <OptionActions>
            <Button onClick={handleCurrentActionValidation}>Valider</Button>
            <Button onClick={handleCurrentActionCancel} reverse>
              Annuler
            </Button>
          </OptionActions>
        </OptionContainer>
      )}
    </ImageEditorContainer>
  )
}

export default ImageEditor
