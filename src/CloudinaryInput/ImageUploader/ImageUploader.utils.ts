import { get } from 'lodash'

import { createCloudinaryURL } from '../CloudinaryInput.utils'

export const getTitle = ({ status, selectedImage, directory }) => {
  if (status === 'home') {
    return 'Liste des dossiers'
  }

  if (status === 'directory') {
    return `Dossier : ${decodeURIComponent(directory)}`
  }

  if (status === 'uploader') {
    return `Dossier : ${directory} (ajout d'une image)`
  }

  if (status === 'customizer') {
    const imageId = get(selectedImage, 'public_id', 'image inconnue')
    return `Personnalisation de ${imageId}`
  }

  return ''
}

export const getImageInOutputFormat = ({ image, imageFormat }) => {
  if (imageFormat === 'ace') {
    return image
  }

  if (imageFormat === 'id') {
    return image.id
  }

  return createCloudinaryURL(image)
}
