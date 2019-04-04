import * as React from 'react'
import { memoize, filter, floor, get, find, values } from 'lodash'
import { Spinner, FontIcon, Button, TextInput } from '@habx/thunder-ui'

import Image from '../Image'
import { createCloudinaryURL } from '../CloudinaryInput.utils'

import {
  ImageEditorContainer,
  ImageContainer,
  OptionsContainer,
  OptionContainer,
  OptionContent,
  OptionActions,
  Slider,
  ImageCroper,
  SpinnerContainer
} from './ImageEditor.style'
import ImageEditorProps, { ImageEditorState, CropConfiguration } from './ImageEditor.interface'

const getImageMaxWidth = (image, transformation) => {
  const factor = get(transformation, 'width', 1)
  return floor(image.width * (factor > 1 ? (factor / image.width) : factor))
}

const getCropTransform = transforms => {
  const matchingTransform = find(transforms, el => get(el, 'crop') === 'crop')

  if (matchingTransform) {
    return {
      ...matchingTransform,
      width: parseInt(get(matchingTransform, 'width', 1), 10),
      height: parseInt(get(matchingTransform, 'height', 1), 10),
      x: parseInt(get(matchingTransform, 'x', 0), 10),
      y: parseInt(get(matchingTransform, 'y', 0), 10)
    }
  }
}

const getInitialState = ({ initialTransforms, image }) => {
  const cropTransform = getCropTransform(initialTransforms)
  const dimensionTransform = find(initialTransforms, el => get(el, 'crop') === 'scale' && el.width)

  const cropConfig = cropTransform && {
    width: cropTransform.width < 1 ? (cropTransform.width * 100) : (cropTransform.width / image.width * 100),
    height: cropTransform.height < 1 ? (cropTransform.height * 100) : (cropTransform.height / image.height * 100),
    x: cropTransform.x < 1 ? (cropTransform.x * 100) : (cropTransform.x / image.width * 100),
    y: cropTransform.y < 1 ? (cropTransform.y * 100) : (cropTransform.y / image.width * 100)
  }

  return {
    currentAction: null,
    crop: cropConfig,
    transformations: {
      crop: cropTransform,
      dimensions: dimensionTransform || {
        width: Math.min(getImageMaxWidth(image, cropTransform), 1000),
        crop: 'scale'
      }
    },
    transformationsBackup: null
  }
}

class ImageEditor extends React.PureComponent<ImageEditorProps, ImageEditorState> {
  state = getInitialState(this.props)

  componentDidMount () {
    this.handleChange()
  }

  setAction = memoize(action => () => this.setState(prevState => ({
    currentAction: action,
    transformationsBackup: prevState.transformations
  })))

  validateAction = () => {
    this.setState(() => ({ currentAction: null }), this.handleChange)
  }

  cancelAction = () => {
    this.setState(prevState => ({
      currentAction: null,
      transformations: prevState.transformationsBackup,
      transformationsBackup: null
    }))
  }

  updateTransformations (transformationType, value) {
    this.setState(prevState => ({
      transformations: {
        ...prevState.transformations,
        [transformationType]: value
      }
    }))
  }

  handleCropChange = (crop: CropConfiguration) => {
    this.setState(() => ({ crop }))

    const { width, height, x, y } = crop

    const isValidCrop = (width !== 100 || height !== 100) && (width !== 0 || height !== 0)

    if (!isValidCrop) {
      return this.updateTransformations('crop', null)
    }

    const transformation = {
      crop: 'crop',
      width: width / 100,
      height: height / 100,
      x: x / 100,
      y: y / 100
    }

    return this.updateTransformations('crop', transformation)
  }

  handleDimensionsChange = width => this.updateTransformations(
    'dimensions',
    { crop: 'scale', width }
    )

  handleChange = () => {
    const { image, onChange } = this.props
    const { transformations } = this.state

    onChange({
      id: image.public_id,
      transforms: values(transformations)
    })
  }

  renderImage () {
    const { image } = this.props
    const { currentAction, crop, transformations } = this.state

    const transformationsToApply = filter(transformations, (value, key) => key !== currentAction)

    if (currentAction === 'crop') {
      return (
        <ImageCroper
          src={createCloudinaryURL({ id: image.public_id, transforms: transformationsToApply })}
          onChange={this.handleCropChange}
          crop={crop}
        />
      )
    }

    return <Image id={image.public_id} size='full' transforms={transformationsToApply} />
  }

  renderDimensionSlider () {
    const { image } = this.props
    const { transformations } = this.state

    const maxWidth = getImageMaxWidth(image, transformations.crop)
    const value = get(transformations, 'dimensions.width', Math.min(maxWidth, 1000))

    return (
      <Slider
        value={value}
        max={maxWidth}
        onChange={this.handleDimensionsChange}
      />
    )
  }

  render () {
    const { image } = this.props
    const { currentAction } = this.state

    if (!image) {
      return (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )
    }

    return (
      <ImageEditorContainer>
        <ImageContainer>
          { this.renderImage() }
        </ImageContainer>
        {
          !currentAction && (
            <OptionsContainer>
              <Button
                onClick={this.setAction('crop')}
                iconLeft={<FontIcon icon='crop' />}
                reverse
              >
                Cropper
              </Button>
              <Button
                onClick={this.setAction('dimensions')}
                iconLeft={<FontIcon icon='photo_size_select_large' />}
                reverse
              >
                Redimensionner
              </Button>
            </OptionsContainer>
          )
        }
        {
          currentAction && (
            <OptionContainer>
              <OptionContent>
                { currentAction === 'crop' && 'Sélectionnez la zone à garder' }
                { currentAction === 'dimensions' && this.renderDimensionSlider()}
              </OptionContent>
              <OptionActions>
                <Button onClick={this.validateAction}>Valider</Button>
                <Button onClick={this.cancelAction} reverse>Annuler</Button>
              </OptionActions>
            </OptionContainer>
          )
        }
      </ImageEditorContainer>
    )

  }
}

export default ImageEditor
