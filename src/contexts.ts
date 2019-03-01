import { createContext } from 'react'

import { FormSectionStatus } from './FormSection/FormSection.interface'

interface StatusContextProps {
  disabled?: boolean
  showErrors: boolean
  sectionStatuses: object
  setSectionStatus: (sectionName: string, sectionStatus: FormSectionStatus) => void,
  actions: {
    change: (name: string, value?: any) => void
  }
}

export interface SectionContextProps {
  setError: (fieldName: string, error: string) => void
  showErrors: boolean
}

export const StatusContext = createContext<StatusContextProps>({
  disabled: false,
  showErrors: true,
  sectionStatuses: {},
  setSectionStatus: () => null,
  actions: {
    change: () => null
  }
})

export const SectionContext = createContext<SectionContextProps>({
  setError: () => null,
  showErrors: true
})
