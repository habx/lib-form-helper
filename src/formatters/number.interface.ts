import { IntlShape } from '@habx/lib-client-intl'

import { EMPTY, PRECISION } from './number'

export interface FormatNumberOptions {
  /** Apply a factor to the input number (e.g. for unit conversion). */
  factor?: number

  /** The `Intl` API used for locale aware number formatting. */
  intl?: IntlShape
}

export interface FormatNumberProxy extends Number {
  [EMPTY]: boolean
  [PRECISION]: number
}
