import { filter, floor, get, find, values } from 'lodash'
import * as React from 'react'
import { useReducer } from 'react'

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
      width: parseInt(get(matchingTransform, 'width', 1), 10),
      height: parseInt(get(matchingTransform, 'height', 1), 10),
      x: parseInt(get(matchingTransform, 'x', 0), 10),
      y: parseInt(get(matchingTransform, 'y', 0), 10),
    }
  }
}

const getInitialState = ({ initialTransforms, image }): ImageEditorState => {
  const cropTransform = getCropTransform(initialTransforms)
  const dimensionTransform = find(
    initialTransforms,
    el => get(el, 'crop') === 'scale' && el.width
  )

  const cropConfig = cropTransform && {
    width:
      cropTransform.width < 1
        ? cropTransform.width * 100
        : (cropTransform.width / image.width) * 100,
    height:
      cropTransform.height < 1
        ? cropTransform.height * 100
        : (cropTransform.height / image.height) * 100,
    x:
      cropTransform.x < 1
        ? cropTransform.x * 100
        : (cropTransform.x / image.width) * 100,
    y:
      cropTransform.y < 1
        ? cropTransform.y * 100
        : (cropTransform.y / image.width) * 100,
  }

  return {
    currentAction: null,
    crop: cropConfig,
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
      const { width, height, x, y } = action.value

      const isValidCrop =
        (width !== 100 || height !== 100) && (width !== 0 || height !== 0)

      const transformationCrop = isValidCrop
        ? {
            crop: 'crop',
            width: width / 100,
            height: height / 100,
            x: x / 100,
            y: y / 100,
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
  const [state, dispatch] = useReducer(
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
    dispatch({ type: 'UPDATE_CROP_VALUE', value: crop })
  }, [])

  const handleDimensionsChange = React.useCallback(
    width => dispatch({ type: 'UPDATE_DIMENSIONS_VALUE', value: width }),
    []
  )

  React.useEffect(() => {
    onChange({
      id: image.public_id,
      transforms: values(state.transformations),
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
