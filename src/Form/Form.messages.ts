export type messageIds = 'errors.required.full' | 'errors.on.child'

export const fr: Record<messageIds, string> = {
  'errors.required.full': 'ce champs est requis',
  'errors.on.child': 'contient des erreurs',
}

export const en: Record<messageIds, string> = {
  'errors.required.full': 'required field',
  'errors.on.child': 'contains errors',
}
