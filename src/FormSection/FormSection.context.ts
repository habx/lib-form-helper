import * as React from 'react'

import { SectionContextProps } from './FormSection.interface'

export default React.createContext<SectionContextProps>({
  name: '',
  path: [],
})
