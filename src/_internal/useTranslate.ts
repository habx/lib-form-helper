import * as React from 'react'

import { StatusContext } from '../contexts'

export type Message =
  | 'errors.required.short'
  | 'errors.required.full'
  | 'errors.on.child'

const messagesFr: Record<Message, string> = {
  'errors.required.short': 'obligatoire',
  'errors.required.full': 'Ce champs est requis',
  'errors.on.child': 'contient des erreurs',
}

const messagesEn: Record<Message, string> = {
  'errors.required.short': 'required',
  'errors.required.full': 'Required field',
  'errors.on.child': 'contains errors',
}

const useTranslate = () => {
  const { language } = React.useContext(StatusContext)

  return React.useCallback(
    (key: Message) => {
      const messages = language === 'fr' ? messagesFr : messagesEn

      return messages[key]
    },
    [language]
  )
}

export default useTranslate
