import { IntlShape } from '@habx/lib-client-intl'

import { PRECISION, SIGN } from './number.constants'

export type Sign = -1 | 0 | 1

export interface FormatNumberOptions {
  /** Apply a factor to the input number (e.g. for unit conversion). */
  factor?: number

  /** The `Intl` API used for locale aware number formatting. */
  intl?: IntlShape
}

export interface FormatNumberProxy extends Number {
  /**
   * Stores the number of digits to display in order to preserve trailing zeros between parse and format operations.
   * Some special values are used:
   * - `0` to keep the decimal separator when the decimal part is empty
   * - `-1` to represent numbers without a decimal part, i.e. integers
   * - `-2` to mark the given number as an empty value
   */
  [PRECISION]: number

  /**
   * Stores the sign of the parsed number.
   * Its main purpose is to preserve the minus symbol in some expressions like `-` or `-0`.
   */
  [SIGN]: Sign
}
