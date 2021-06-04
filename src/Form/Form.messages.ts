export type messageIds =
  | 'errors.required.full'
  | 'errors.on.child'
  | 'decorators.preventLeaving.message'

export const fr: Record<messageIds, string> = {
  'errors.required.full': 'ce champs est requis',
  'errors.on.child': 'contient des erreurs',
  'decorators.preventLeaving.message':
    'quitter sans sauvegarder les modifications ?',
}

export const en: Record<messageIds, string> = {
  'errors.required.full': 'required field',
  'errors.on.child': 'contains errors',
  'decorators.preventLeaving.message': 'leave without saving modifications ?',
}
