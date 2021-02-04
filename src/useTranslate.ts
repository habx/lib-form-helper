import { buildIntl } from '@habx/lib-client-intl'

import { messageIds } from './Form'

export const { useTranslate, IntlProvider } = buildIntl<messageIds>({
  prefix: 'form-helper',
})
