import { FormatNumberOptions, FormatNumberProxy } from './number.interface'

export const EMPTY = Symbol()

export const PRECISION = Symbol()

export const format = (
  value: FormatNumberProxy | number | null | undefined,
  options: FormatNumberOptions = {}
): string => {
  const { factor = 1 } = options
  const parsedValue =
    value instanceof Number
      ? value
      : parse(
          Number.isFinite(value) ? (value as number) / factor : value,
          options
        )
  const primitive = parsedValue.valueOf()
  const precision = parsedValue[PRECISION]

  if (!isFinite(primitive)) {
    return ''
  }

  const rawValue = primitive / factor
  const integer = (rawValue < 0 ? Math.ceil : Math.floor)(rawValue)

  let formattedinteger: string
  let separator: string

  if (options.intl) {
    formattedinteger = options.intl.formatNumber(integer)
    separator = options.intl.formatNumber(1.1).charAt(1)
  } else {
    formattedinteger = integer.toString()
    separator = '.'
  }

  return (
    formattedinteger +
    (precision < 0
      ? ''
      : separator +
        Math.abs(rawValue - integer)
          .toFixed(precision + 1)
          .slice(2, -1))
  )
}

export const normalize = (
  value: FormatNumberProxy | number | null | undefined
): number | null => {
  return value instanceof Number
    ? value[EMPTY]
      ? null
      : value.valueOf()
    : value === undefined
    ? null
    : value
}

export const parse = (
  input: string | number | null | undefined,
  { factor = 1 }: FormatNumberOptions = {}
): FormatNumberProxy => {
  if (input === null || input === undefined || input === '') {
    return proxy()
  }

  let parsedValue: number
  let value: string

  if (typeof input === 'string') {
    value = input
      // Handles digit grouping using a space separator (e.g. `1 000`).
      .replace(/\s/g, '')
      // Handles decimal comma separator (e.g. `0,1`).
      .replace(',', '.')

    // Handles numbers without an integer part (e.g. `.314`).
    if (value.startsWith('.')) {
      value = `0${value}`
    }

    parsedValue = parseFloat(value)
  } else {
    parsedValue = input
    value = input.toString()
  }

  const precision = value.split('.')[1]?.replace(/[^\d]*/g, '').length ?? -1

  return proxy(
    isFinite(parsedValue) ? parsedValue * factor : parsedValue,
    precision
  )
}

export const proxy = (value?: number, precision = -1): FormatNumberProxy => {
  // eslint-disable-next-line no-new-wrappers
  return new Proxy(new Number(value), {
    get(target, key, receiver) {
      return key === EMPTY
        ? value === undefined
        : key === PRECISION
        ? precision
        : Reflect.get(target, key, receiver)?.bind(target)
    },
  }) as FormatNumberProxy
}
