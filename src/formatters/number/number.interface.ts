import { IntlShape } from '@habx/lib-client-intl'

export type Sign = ParsedNumber['sign']

export interface FormatOptions {
  /** The factor to be applied to the input number (e.g. for unit conversion). */
  factor?: number

  /** The `Intl` API used for locale aware number formatting. */
  intl?: IntlShape
}

export interface Options extends FormatOptions {
  /** Listener for when the parsed value has been modified. */
  onChange?(value: number | null): void

  /** The parsed value. */
  value?: number | null
}

export interface ParsedNumber {
  /**
   * The number of digits to display in order to preserve trailing zeros between parse and format operations.
   * Some special values are used:
   * - `0` to keep the decimal separator when the decimal part is empty
   * - `-1` to represent numbers without a decimal part, i.e. integers
   * - `-2` to indicate that the given number is an empty value
   */
  precision: number

  /**
   * The sign of the parsed value.
   * Its main purpose is to preserve the minus symbol in some expressions like `-` or `-0`.
   */
  sign: -1 | 0 | 1

  /** The parsed value. */
  value: number | null
}

export interface State {
  formatted: string
  parsed: ParsedNumber
}
