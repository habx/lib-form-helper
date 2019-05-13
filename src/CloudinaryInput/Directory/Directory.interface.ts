import { CloudinaryImage } from '../Image/Image.interface'

export default interface DirectoryProps {
  images: CloudinaryImage[]
  selectedImage: CloudinaryImage
  loading: boolean
  onImageClick: (image: CloudinaryImage) => void
}
