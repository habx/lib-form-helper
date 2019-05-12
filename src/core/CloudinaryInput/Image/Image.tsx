import * as React from 'react'

import { createCloudinaryURL } from '../CloudinaryInput.utils'

import ImageProps from './Image.interface'

export const buildURL = (id, { size, transforms = [] }) =>
  createCloudinaryURL({
    id,
    transforms: [
      ...transforms,
      ...(size === 'thumbnail' ? [{ crop: 'limit', width: 300 }] : []),
    ],
  })

const Image: React.FunctionComponent<ImageProps> = ({
  id,
  size,
  transforms,
  ...props
}) => (
  <img src={buildURL(id, { size, transforms })} alt="Cloudinary" {...props} />
)

export default Image
