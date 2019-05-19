import * as React from 'react'

import { CloudinaryInputContextProps } from './CloudinaryInput.interface'

const DEFAULT_CONTEXT = {} as CloudinaryInputContextProps

const CloudinaryInputContext = React.createContext(DEFAULT_CONTEXT)

export default CloudinaryInputContext
