import { IntlShape } from '@habx/lib-client-intl'

import { PRECISION, SIGN } from './number'

export type Sign = -1 | 0 | 1

export interface FormatNumberOptions {
  /** Apply a factor to the input number (e.g. for unit conversion). */
  factor?: number

  /** The `Intl` API used for locale aware number formatting. */
  intl?: IntlShape
}

export interface FormatNumberProxy extends Number {
  [PRECISION]: number
  [SIGN]: Sign
}
