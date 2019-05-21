import {
  CloudinaryImage,
  ACECloudinaryImage,
  ImageFile,
} from '../Image/Image.interface'

export type RenderParams = {
  directory: string
  renderImage: (image: CloudinaryImage) => JSX.Element
}

export interface ImageUploaderState {
  selectedImage?: CloudinaryImage
  customizedImage?: ACECloudinaryImage
  directory: string
  fieldImageConfig?: CloudinaryImage
  images: CloudinaryImage[]
}

export default interface ImageUploaderProps {
  status: string
  defaultDirectory?: string
  renderImages: (RenderParams) => JSX.Element
  onChange: (image: ACECloudinaryImage | string) => void
  image: ACECloudinaryImage
  fetchImageConfig: (path: string) => Promise<CloudinaryImage>
  uploadImage: (
    image: ImageFile,
    params: { directory: string }
  ) => Promise<CloudinaryImage>
}

export interface ActionBarProps {
  onSelect: (params: { withCustomization: boolean }) => void
}
