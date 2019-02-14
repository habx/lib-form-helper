import { createContext } from 'react'

export const StatusContext = createContext({
  disabled: false,
  sectionStatuses: {},
  setSectionStatus: () => null
})

export const SectionContext = createContext({
  setError: () => null
})
