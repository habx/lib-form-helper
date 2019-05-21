import {
  ACECloudinaryImage,
  CloudinaryImage,
  ImageFile,
} from './Image/Image.interface'
import { RenderParams } from './ImageUploader/ImageUploader.interface'

export default interface CloudinaryInputProps {
  value: string | ACECloudinaryImage
  disabled?: boolean
  defaultDirectory?: string
  renderImages: (params: RenderParams) => JSX.Element
  onChange: (src: string) => void
  imageFormat: string
  fetchImageConfig: (path: string) => Promise<CloudinaryImage>
  uploadImage: (
    image: ImageFile,
    params: { directory: string }
  ) => Promise<CloudinaryImage>
}

export interface CloudinaryInputContextProps {
  setStatus: (status: string) => void
  status: string
  imageFormat: string
}
