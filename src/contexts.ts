import * as React from 'react'

type sectionCallback = (
  fieldID: number,
  type: 'error' | 'dirty',
  value: any
) => void

export interface StatusContextProps {
  disabled?: boolean
  showErrors: boolean
  subscribeSection: (
    sectionId: number,
    section: {
      id?: string
      callback: sectionCallback
    }
  ) => void
  subscribeSectionWatcher: (watcher: {
    id: string
    uId: number
    callback: sectionCallback
  }) => void
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
