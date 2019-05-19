import * as React from 'react'

import { SectionContext, StatusContext } from './contexts'

const useStatus = () => {
  const form = React.useContext(StatusContext)
  const section = React.useContext(SectionContext)

  return { form, section }
}

export default useStatus
