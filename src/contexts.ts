import * as React from 'react'

import { FormSectionStatus } from './FormSection/FormSection.interface'
import Actions from './useActions/useActions.interface'

export interface StatusContextProps {
  disabled?: boolean
  showErrors: boolean
  sectionStatuses: object
  setSectionStatus: (
    sectionName: string,
    sectionStatus: FormSectionStatus
  ) => void
  actions: Actions
}

export interface SectionContextProps {
  setError: (fieldName: string, error: string) => void
  showErrors: boolean
  name: string
}

export const StatusContext = React.createContext<StatusContextProps>({
  disabled: false,
  showErrors: true,
  sectionStatuses: {},
  setSectionStatus: () => null,
  actions: {
    change: () => null,
  },
})

export const SectionContext = React.createContext<SectionContextProps>({
  setError: () => null,
  showErrors: true,
  name: '',
})
