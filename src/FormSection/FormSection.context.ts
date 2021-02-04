import * as React from 'react'

import { SectionContextProps } from './FormSection.interface'

export const DEFAULT_SECTION_CONTEXT: SectionContextProps = {
  name: '',
  path: [],
}

export const FormSectionContext = React.createContext<SectionContextProps>(
  DEFAULT_SECTION_CONTEXT
)
