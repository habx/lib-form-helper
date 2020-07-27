import { IntlShape } from '@habx/lib-client-intl'

import { PRECISION, SIGN, format, parse, proxy } from './number'

describe('Number parse', () => {
  it('handles missing values', () => {
    const test = (value: any) => {
      const result = parse(value)

      expect(result.valueOf()).toBeNaN()
      expect(result[PRECISION]).toEqual(-2)
    }

    ;['', null, undefined].map(test)
  })

  it('handles invalid values', () => {
    {
      const result = parse('not 1 number')

      expect(result.valueOf()).toBeNaN()
      expect(result[PRECISION]).toEqual(-1)
    }
    {
      const result = parse(NaN)

      expect(result.valueOf()).toBeNaN()
      expect(result[PRECISION]).toEqual(-1)
    }
    {
      const result = parse(Infinity)

      expect(result.valueOf()).toEqual(Infinity)
      expect(result[PRECISION]).toEqual(-1)
    }
  })

  const test = ({
    value,
    precision = -1,
    raw = value,
    sign = Math.sign(value),
    ...options
  }: {
    raw?: any
    value: number
    precision?: number
    sign?: number
  }) => {
    const result = parse(raw, options)

    expect(result.valueOf()).toEqual(value)
    expect(result[PRECISION]).toEqual(precision)
    expect(result[SIGN]).toEqual(sign)
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
    expect(format(proxy())).toEqual('')
    expect(format(null)).toEqual('')
    expect(format(undefined)).toEqual('')
    expect(format(proxy(0, { precision: -2 }))).toEqual('')
  })

  it('handles invalid values', () => {
    expect(format(NaN)).toEqual('')
    expect(format(Infinity)).toEqual('')
  })

  it('handles precision', () => {
    expect(format(1)).toEqual('1')
    expect(format(proxy(0, { precision: 0 }))).toEqual('0.')
    expect(format(proxy(-0, { precision: 0, sign: -1 }))).toEqual('-0.')
    expect(format(proxy(1.2, { precision: 1 }))).toEqual('1.2')
    expect(format(proxy(0.07, { precision: 3 }))).toEqual('0.070')
  })

  it('handles applying a factor', () => {
    expect(format(123456789, { factor: 1e4 })).toEqual('12345.6789')
  })

  it('handles using a locale', () => {
    const intl = {
      formatNumber: new Intl.NumberFormat('fr-FR').format,
    } as IntlShape

    // `Intl.NumberFormat` does not generate regular spaces.
    expect(format(1e6, { intl })).toMatch(/^1\s000\s000$/)
    expect(format(0.123, { intl })).toEqual('0,123')
  })
})
