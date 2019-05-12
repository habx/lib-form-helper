import * as React from 'react'

export type CloudinaryImage = {
  secure_url: string
  public_id: string
  version: number
  height: number
  width: number
}

export type ACECloudinaryImage = {
  id: string
  transforms?: object[]
}

export type ImageFile = {
  type: string
  size: number
}

export default interface ImageProps extends React.HTMLAttributes<any> {
  id: string
  size: 'thumbnail' | 'full'
  transforms?: object[]
}
