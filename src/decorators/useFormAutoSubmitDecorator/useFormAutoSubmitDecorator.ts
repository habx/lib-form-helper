import { Decorator, FormState, Subscriber } from 'final-form'
import { debounce } from 'lodash'
import * as React from 'react'

export type UseFormAutoSubmitDecoratorConfig = {
  /**
   * For fields with frequent updates (<input type="text" /> for instance), we don't want to submit the form on each keystroke
   */
  debouncedFields?: string[]

  /**
   * @default 500
   */
  debounceDuration?: number
}

const DEFAULT_DEBOUNCE_DURATION = 500

export const useFormAutoSubmitDecorator = <Params = any>(
  config: UseFormAutoSubmitDecoratorConfig = {}
) => {
  const configRef = React.useRef(config)
  configRef.current = config

  return React.useCallback<Decorator<Params, Partial<Params>>>((form) => {
    const {
      debouncedFields = [],
      debounceDuration = DEFAULT_DEBOUNCE_DURATION,
    } = configRef.current

    const submit = form.submit
    const debouncedSubmit = debounce(submit, debounceDuration)

    const subscriber: Subscriber<FormState<any>> = (state) => {
      const dirty = Object.keys(state.dirtyFieldsSinceLastSubmit).length

      if (dirty) {
        const shouldDebounce = debouncedFields.some(
          (field) => state.dirtyFieldsSinceLastSubmit[field]
        )

        if (shouldDebounce) {
          debouncedSubmit()
        } else {
          debouncedSubmit.cancel()
          submit()
        }
      }
    }

    return form.subscribe(subscriber, {
      dirtyFieldsSinceLastSubmit: true,
      /*
       * Listen to `values` even if we are not using it explicitly.
       * Otherwise, debounced fields will only be submitted once.
       */
      values: true,
    })
  }, [])
}
