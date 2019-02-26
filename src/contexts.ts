import { createContext } from 'react'

import { FormSectionStatus } from './FormSection/FormSection.interface'

interface StatusContextProps {
  disabled?: boolean
  sectionStatuses: object
  setSectionStatus: (sectionName: string, sectionStatus: FormSectionStatus) => void,
  actions: {
    change: (name: string, value?: any) => void
  }
}

interface SectionContextProps {
  setError: (fieldName: string, error: string) => void
}

export const StatusContext = createContext<StatusContextProps>({
  disabled: false,
  sectionStatuses: {},
  setSectionStatus: () => null,
  actions: {
    change: () => null
  }
})

export const SectionContext = createContext<SectionContextProps>({
  setError: () => null
})
