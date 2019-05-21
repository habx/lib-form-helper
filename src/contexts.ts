import * as React from 'react'

export interface StatusContextProps {
  disabled?: boolean
  showErrors: boolean
  subscribeSection: (
    sectionId: number,
    section: {
      id?: string
      callback: (fieldID: number, type: 'error' | 'dirty', value: any) => void
    }
  ) => void
  setFieldStatus: (
    fieldID: number,
    sections: number[],
    type: 'error' | 'dirty',
    value: any
  ) => void
}

export interface SectionContextProps {
  name: string
  path: number[]
}

export const StatusContext = React.createContext<StatusContextProps>({
  disabled: false,
  showErrors: true,
} as StatusContextProps)

export const SectionContext = React.createContext<SectionContextProps>({
  name: '',
  path: [],
})
