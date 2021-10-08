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
    // Keep printing multiple 0
    formatted:
      parsedNumber.value === 0 && typeof input === 'string'
        ? input
        : format(parsedNumber, options),
    parsed: parsedNumber,
  }
}

export const useFormattedNumber = ({
  factor,
  intl,
  onChange,
  value,
  inputRef,
}: Options = DEFAULT_OPTIONS) => {
  const [state, setState] = React.useState(() =>
    createState(value, { factor, intl })
  )
  const stateRef = React.useRef(state)

  // Synchronizes the reference with the current state.
  React.useEffect(() => {
    stateRef.current = state
  }, [state])

  // Resets the state if the provided value changed programmatically.
  React.useEffect(() => {
    if (value !== undefined && value !== stateRef.current.parsed.value) {
      setState(createState(value, { factor, intl }))
    }
  }, [factor, intl, value])

  const cursorPositionRef = React.useRef(0)
  React.useEffect(() => {
    inputRef?.current.setSelectionRange(
      cursorPositionRef.current,
      cursorPositionRef.current
    )
  }, [state.formatted])

  const handleChange = React.useCallback(
    (input?: string | number | null) => {
      const newState = createState(input, { factor, intl })

      if (!isEqual(newState, stateRef.current)) {
        setState(newState)

        const currentCursorPosition = inputRef?.current.selectionStart ?? 0
        const lengthDiff =
          newState.formatted.length - stateRef.current.formatted.length
        cursorPositionRef.current =
          currentCursorPosition +
          (lengthDiff > 0 ? lengthDiff - 1 : lengthDiff + 1)
      }

      if (newState.parsed.value !== stateRef.current.parsed.value) {
        onChange?.(newState.parsed.value)
      }
    },
    [factor, intl, onChange]
  )

  return [state.formatted, handleChange] as const
}
