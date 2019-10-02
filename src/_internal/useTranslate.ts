import * as React from 'react'

import { InternationalStrings, FormContext } from '../FormHelperProvider'

const useTranslate = () => {
  const { intl } = React.useContext(FormContext)

  return React.useCallback((key: keyof InternationalStrings) => intl[key], [
    intl,
  ])
}

export default useTranslate
