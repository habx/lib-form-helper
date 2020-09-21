import { FormatOptions, ParsedNumber, Sign } from './number.interface'

export const create = (
  value?: number,
  parameters: { precision?: number; sign?: Sign } = {}
): ParsedNumber => {
  return {
    precision: parameters.precision ?? (value === undefined ? -2 : -1),
    sign:
      parameters.sign ?? ((value === undefined ? 0 : Math.sign(value)) as Sign),
    value: value ?? null,
  }
}

export const format = (
  parsedNumber: ParsedNumber,
  options: FormatOptions
): string => {
  const { precision } = parsedNumber
  const { factor = 1 } = options
  const isNegative = parsedNumber.sign === -1

  if (precision < -1) {
    return isNegative ? '-' : ''
  }

  const parsedValue = parsedNumber.value

  if (parsedValue === null || !isFinite(parsedValue)) {
    return ''
  }

  const value = parsedValue / factor
  const integer = Math.floor(Math.abs(value))

  let formattedInteger = isNegative || value < 0 ? '-' : ''
  let separator: string

  if (options.intl) {
    formattedInteger += options.intl.formatNumber(integer)
    separator = options.intl.formatNumber(1.1).charAt(1)
  } else {
    formattedInteger += integer.toString()
    separator = '.'
  }

  return (
    formattedInteger +
    (precision < 0
      ? ''
      : separator +
        (Math.abs(value) - integer).toFixed(precision + 1).slice(2, -1))
  )
}

export const parse = (
  input: string | number | null | undefined,
  factor: number
): ParsedNumber => {
  if (input === null || input === undefined || input === '') {
    return create()
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
        return create(-0, { precision: -2, sign: -1 })
      }

      value = value.slice(1)
      sign = -1
    }

    // Handles numbers without an integer part (e.g. `'.314'`).
    if (value.startsWith('.')) {
      value = `0${value}`
    }

    const parsedFloat = parseFloat(value)

    if (Number.isNaN(parsedFloat)) {
      return create()
    }

    parsedValue = (sign ?? 1) * parsedFloat
  } else {
    parsedValue = input
    value = input.toString()
  }

  const isValid = isFinite(parsedValue)

  return create(isFinite(parsedValue) ? parsedValue * factor : parsedValue, {
    precision: isValid
      ? value.split('.')[1]?.replace(/[^\d]*/g, '').length ?? -1
      : -1,
    sign,
  })
}
