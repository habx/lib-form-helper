import * as React from 'react'

export default interface HeaderProps {
  title: string
  onUploadImages: (e: React.FormEvent<HTMLInputElement>) => void
}
