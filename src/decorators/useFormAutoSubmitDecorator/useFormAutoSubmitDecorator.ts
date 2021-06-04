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

export const useFormAutoSubmitDecorator = (
  config: UseFormAutoSubmitDecoratorConfig = {}
) => {
  const configRef = React.useRef(config)
  configRef.current = config

  return React.useCallback<Decorator<any, any>>((form) => {
    const {
      debouncedFields = [],
      debounceDuration = DEFAULT_DEBOUNCE_DURATION,
    } = configRef.current

    const submit = form.submit
    const debouncedSubmit = debounce(submit, debounceDuration)

    const subscriber: Subscriber<FormState<any>> = (state) => {
      /*
       * The current value is equal to the initial value we don't want to subscribe
       */
      if (state.pristine) {
        return
      }

      const hasDebouncedDirtyField = debouncedFields.some(
        (field) => state.dirtyFields[field]
      )
      if (hasDebouncedDirtyField) {
        debouncedSubmit()
      } else {
        debouncedSubmit.cancel()
        submit()
      }
    }

    return form.subscribe(subscriber, {
      /*
       * We need to listen to "values" even if we are not using it explicitly
       * Otherwise, debounced field will only be triggered once
       */
      values: true,
      pristine: true,
      dirtyFields: true,
    })
  }, [])
}
