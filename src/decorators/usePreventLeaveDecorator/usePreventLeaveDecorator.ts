import { Decorator, FormState, Subscriber } from 'final-form'
import * as React from 'react'
import type { useHistory } from 'react-router'

import { confirm } from '@habx/ui-core'

const DEFAULT_MESSAGE = 'Quitter sans sauvegarder les modifications ?'

export const usePreventLeaveDecorator = (
  history?: ReturnType<typeof useHistory>,
  options?: UsePreventLeaveDecoratorOptions
) => {
  const shouldPreventLeaving = React.useRef(false)

  React.useEffect(() => {
    const preventNavigation = (e: BeforeUnloadEvent) => {
      if (shouldPreventLeaving.current) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', preventNavigation, false)

    return () => window.removeEventListener('beforeunload', preventNavigation)
  }, [])

  React.useEffect(() => {
    if (!history) {
      return
    }

    const unblock = history.block((location) => {
      if (shouldPreventLeaving.current) {
        const confirmLeaving = async () => {
          const hasConfirmed = await confirm(
            options?.message ?? DEFAULT_MESSAGE
          )

          if (hasConfirmed) {
            unblock()
            history.push(location)
          }
        }

        confirmLeaving()

        return false
      }
    })

    return unblock
  }, [])

  return React.useCallback<Decorator<any, any>>((form) => {
    const subscriber: Subscriber<FormState<any>> = (state) => {
      /*
       * dirtySinceLastSubmit is false until we submit the form when pristine keeps initial initialValues
       * for references
       */
      shouldPreventLeaving.current = state.submitSucceeded
        ? state.dirtySinceLastSubmit
        : !state.pristine
    }

    return form.subscribe(subscriber, {
      dirtySinceLastSubmit: true,
      pristine: true,
      submitSucceeded: true,
    })
  }, [])
}

export interface UsePreventLeaveDecoratorOptions {
  message?: string
}
