import { Decorator, FormState, FormSubscription, Subscriber } from 'final-form'
import * as React from 'react'
import type { useHistory } from 'react-router'

import { confirm } from '@habx/ui-core'

const DEFAULT_CONFIRM = 'Quitter'
const DEFAULT_MESSAGE = 'Quitter sans sauvegarder les modifications ?'

export const usePreventLeaveDecorator = <Params = any>(
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
          const hasConfirmed = await confirm({
            cancelLabel: options?.cancelLabel,
            confirmLabel: options?.confirmLabel ?? DEFAULT_CONFIRM,
            message: options?.message ?? DEFAULT_MESSAGE,
          })

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

  return React.useCallback<Decorator<Params, Partial<Params>>>((form) => {
    const subscriber: Subscriber<FormState<Params>> = (state) => {
      shouldPreventLeaving.current =
        options?.shouldPreventLeaving?.(state) ?? state.dirty
    }

    return form.subscribe(subscriber, options?.subscription ?? { dirty: true })
  }, [])
}

export interface UsePreventLeaveDecoratorOptions {
  cancelLabel?: string
  confirmLabel?: string
  message?: string
  /**
   * @default { dirty: true }
   */
  subscription?: FormSubscription
  /**
   * @default ({ dirty }) => dirty
   */
  shouldPreventLeaving?: (state: FormState<any>) => boolean
}
