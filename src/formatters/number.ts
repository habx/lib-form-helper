import {
  FormatNumberOptions,
  FormatNumberProxy,
  Sign,
} from './number.interface'

export const PRECISION = Symbol()

export const SIGN = Symbol()

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
  const precision = parsedValue[PRECISION]
  const isNegative = parsedValue[SIGN] === -1

  if (precision < -1) {
    return isNegative ? '-' : ''
  }

  const primitive = parsedValue.valueOf()

  if (!isFinite(primitive)) {
    return ''
  }

  const rawValue = primitive / factor
  const integer = Math.floor(Math.abs(rawValue))

  let formattedinteger =
    rawValue < 0 || (rawValue === 0 && isNegative) ? '-' : ''
  let separator: string

  if (options.intl) {
    formattedinteger += options.intl.formatNumber(integer)
    separator = options.intl.formatNumber(1.1).charAt(1)
  } else {
    formattedinteger += integer.toString()
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
    ? value[PRECISION] < -1
      ? null
      : value.valueOf()
    : value ?? null
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
  let sign: Sign | undefined

  if (typeof input === 'string') {
    value = input
      // Handles digit grouping using a space separator (e.g. `'1 000'`).
      .replace(/\s/g, '')
      // Handles decimal comma separator (e.g. `'0,1'`).
      .replace(',', '.')

    // Handles negative numbers (e.g. `'-0.'`).
    if (value.startsWith('-')) {
      // Handles the spacial case `'-'`.
      if (value.length === 1) {
        return proxy(-0, { precision: -2, sign: -1 })
      }

      value = value.slice(1)
      sign = -1
    }

    // Handles numbers without an integer part (e.g. `'.314'`).
    if (value.startsWith('.')) {
      value = `0${value}`
    }

    parsedValue = (sign ?? 1) * parseFloat(value)
  } else {
    parsedValue = input
    value = input.toString()
  }

  const isValid = isFinite(parsedValue)

  return proxy(isFinite(parsedValue) ? parsedValue * factor : parsedValue, {
    precision: isValid
      ? value.split('.')[1]?.replace(/[^\d]*/g, '').length ?? -1
      : -1,
    sign,
  })
}

export const proxy = (
  value?: number,
  parameters: { precision?: number; sign?: Sign } = {}
): FormatNumberProxy => {
  // eslint-disable-next-line no-new-wrappers
  return new Proxy(new Number(value), {
    get(target, key, receiver) {
      return key === SIGN
        ? parameters.sign ?? (value === undefined ? 0 : Math.sign(value))
        : key === PRECISION
        ? parameters.precision ?? (value === undefined ? -2 : -1)
        : Reflect.get(target, key, receiver)?.bind(target)
    },
  }) as FormatNumberProxy
}
