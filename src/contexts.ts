import { createContext } from 'react'

import { FormSectionStatus } from './FormSection/FormSection.interface'

interface StatusContextProps {
  disabled?: boolean
  sectionStatuses: object
  setSectionStatus: (sectionName: string, sectionStatus: FormSectionStatus) => void
}

export const StatusContext = createContext<StatusContextProps>({
  disabled: false,
  sectionStatuses: {},
  setSectionStatus: () => null
})

export const SectionContext = createContext({
  setError: () => null
})
