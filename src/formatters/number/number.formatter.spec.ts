import { IntlShape } from '@habx/lib-client-intl'

import { create, format, parse } from './number.formatter'

describe('Number parse', () => {
  it('handles missing values', () => {
    const test = (value: any) => {
      const result = parse(value, 1)

      expect(result.value).toBeNull()
      expect(result.precision).toEqual(-2)
    }

    ;['', null, undefined].map(test)
  })

  it('handles invalid values', () => {
    {
      const result = parse('not 1 number', 1)

      expect(result.value).toBeNaN()
      expect(result.precision).toEqual(-1)
    }
    {
      const result = parse(NaN, 1)

      expect(result.value).toBeNaN()
      expect(result.precision).toEqual(-1)
    }
    {
      const result = parse(Infinity, 1)

      expect(result.value).toEqual(Infinity)
      expect(result.precision).toEqual(-1)
    }
  })

  const test = ({
    value,
    precision = -1,
    raw = value,
    sign = Math.sign(value),
    factor = 1,
  }: {
    raw?: any
    value: number
    precision?: number
    sign?: number
    factor?: number
  }) => {
    const result = parse(raw, factor)

    expect(result.value).toEqual(value)
    expect(result.precision).toEqual(precision)
    expect(result.sign).toEqual(sign)
  }

  it('handles integers', () => {
    ;[
      { value: 0 },
      { value: 2 },
      { raw: '07', value: 7 },
      { raw: '1 000 000', value: 1e6 },
    ].map(test)
  })

  it('handles floating point numbers', () => {
    ;[
      { raw: ',', value: 0, precision: 0 },
      { raw: '.', value: 0, precision: 0 },
      { raw: '1,', value: 1, precision: 0 },
      { raw: '1.0', value: 1, precision: 1 },
      { raw: '1,2', value: 1.2, precision: 1 },
      { value: 1.012, precision: 3 },
      { raw: '1.0120', value: 1.012, precision: 4 },
    ].map(test)
  })

  it('handles signed numbers', () => {
    ;[
      { value: 0, precision: -1, sign: 0 },
      { value: -1, precision: -1, sign: -1 },
      { raw: '+42', value: 42, precision: -1, sign: 1 },
      { raw: '-', value: -0, precision: -2, sign: -1 },
      { raw: '-0', value: -0, precision: -1, sign: -1 },
      { raw: '-.', value: -0, precision: 0, sign: -1 },
      { raw: '-06', value: -6, precision: -1, sign: -1 },
      { raw: '-3.14', value: -3.14, precision: 2, sign: -1 },
    ].map(test)
  })

  it('handles mixed values', () => {
    ;[
      { raw: '7.00 m²', value: 7, precision: 2 },
      { raw: '2 or 5', value: 2 },
      { raw: '1e4', value: 1e4 },
    ].map(test)
  })

  it('handles applying a factor', () => {
    ;[
      { raw: 10, value: 20, factor: 2 },
      { raw: 10, value: -1, factor: -0.1 },
    ].map(test)
  })
})

describe('Number format', () => {
  it('handles missing values', () => {
    expect(format(create(), {})).toEqual('')
    expect(format(create(0, { precision: -2 }), {})).toEqual('')
  })

  it('handles invalid values', () => {
    expect(format(parse(NaN, 1), {})).toEqual('')
    expect(format(parse(Infinity, 1), {})).toEqual('')
  })

  it('handles precision', () => {
    expect(format(create(1), {})).toEqual('1')
    expect(format(create(0, { precision: 0 }), {})).toEqual('0.')
    expect(format(create(-0, { precision: 0, sign: -1 }), {})).toEqual('-0.')
    expect(format(create(-12, { precision: 0, sign: -1 }), {})).toEqual('-12.')
    expect(format(create(-123, { precision: 1, sign: -1 }), {})).toEqual(
      '-123.0'
    )
    expect(format(create(1.2, { precision: 1 }), {})).toEqual('1.2')
    expect(format(create(0.07, { precision: 3 }), {})).toEqual('0.070')
  })

  it('handles applying a factor', () => {
    expect(
      format(create(123456789, { precision: 4 }), { factor: 1e4 })
    ).toEqual('12345.6789')
    expect(format(create(12345.6789), { factor: 1e-4 })).toEqual('123456789')
  })

  it('handles using a locale', () => {
    const intl = {
      formatNumber: new Intl.NumberFormat('fr-FR').format,
    } as IntlShape

    // `Intl.NumberFormat` does not generate regular spaces.
    expect(format(parse(1e6, 1), { intl })).toMatch(/^1\s000\s000$/)
    expect(format(parse(0.123, 1), { intl })).toEqual('0,123')
  })
})
