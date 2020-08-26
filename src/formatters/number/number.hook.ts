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

export default ({
  factor,
  intl,
  onChange,
  value,
}: Options = DEFAULT_OPTIONS) => {
  const [state, setState] = React.useState(() =>
    createState(value, { factor, intl })
  )
  const stateRef = React.useRef(state)

  // Synchronizes the reference with the current state.
  React.useEffect(() => {
    stateRef.current = state
  }, [state])

  // Resets the state if the provided value changed programatically.
  React.useEffect(() => {
    if (value !== undefined && value !== stateRef.current.parsed.value) {
      setState(createState(value, { factor, intl }))
    }
  }, [factor, intl, value])

  const handleChange = React.useCallback(
    (input?: string | number | null) => {
      const newState = createState(input, { factor, intl })

      if (!isEqual(newState, stateRef.current)) {
        setState(newState)

        if (newState.parsed.value !== stateRef.current.parsed.value) {
          onChange?.(newState.parsed.value)
        }
      }
    },
    [factor, intl, onChange]
  )

  return [state.formatted, handleChange] as const
}
