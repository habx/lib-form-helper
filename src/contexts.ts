import * as React from 'react'

export interface StatusContextProps {
  disabled?: boolean
  showErrors: boolean
}

export interface SectionContextProps {
  name: string
  path: number[]
}

export interface ErrorContextProps {
  subscribeSection: (
    sectionId: number,
    section: {
      id?: string
      callback: (fieldID: number, error?: string) => void
    }
  ) => void
  setFieldError: (fieldID: number, sections: number[], error?: string) => void
}

export const StatusContext = React.createContext<StatusContextProps>({
  disabled: false,
  showErrors: true,
})

export const SectionContext = React.createContext<SectionContextProps>({
  name: '',
  path: [],
})

export const ErrorContext = React.createContext<ErrorContextProps>(
  {} as ErrorContextProps
)
