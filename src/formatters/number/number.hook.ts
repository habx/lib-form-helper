import { isEqual } from 'lodash'
import React from 'react'

import { format, parse } from './number.formatter'
import { FormatOptions, Options, State } from './number.interface'

const DEFAULT_OPTIONS: Options = {}

const createState = (
  input: string | number | null | undefined,
  options: FormatOptions
): State => {
  const { factor = 1 } = options
  const parsedNumber = parse(
    typeof input === 'number' ? input / factor : input,
    factor
  )

  return {
    formatted: format(parsedNumber, options),
    parsed: parsedNumber,
  }
}

export default (options: Options = DEFAULT_OPTIONS) => {
  const [state, setState] = React.useState<State>(
    createState(options.initialValue, options)
  )

  const handleChange = React.useCallback(
    (input?: string | number | null) => {
      const newState = createState(input, options)

      if (!isEqual(newState, state)) {
        setState(newState)

        if (newState.parsed.value !== state.parsed.value) {
          options.onChange?.(newState.parsed.value)
        }
      }
    },
    [options] /* eslint-disable-line react-hooks/exhaustive-deps */
  )

  return { formatted: state.formatted, handleChange }
}
