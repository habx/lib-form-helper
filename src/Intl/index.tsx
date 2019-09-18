import * as React from 'react'

type intlContext = { required?: string; containsErrors?: string }

export const FormIntlContext = React.createContext<intlContext>({
  required: 'obligatoire',
  containsErrors: 'contient des erreurs',
})
export const useTranslate = () => {
  const intl = React.useContext(FormIntlContext)
  return React.useCallback((key: keyof intlContext) => intl[key], [intl])
}
export const FormIntlProvider: React.FunctionComponent<intlContext> = ({
  children,
  ...intlContext
}) => {
  return (
    <FormIntlContext.Provider value={intlContext}>
      {children}
    </FormIntlContext.Provider>
  )
}
