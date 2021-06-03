import { Decorator, FormState, Subscriber } from 'final-form'
import { History } from 'history'
import * as React from 'react'

import { confirm } from '@habx/ui-core'

import { useTranslate } from '../../useTranslate'

export const usePreventLeaveDecorator = (history: History) => {
  const t = useTranslate()
  const pristineRef = React.useRef(false)

  React.useEffect(() => {
    const preventNavigation = (e: BeforeUnloadEvent) => {
      if (!pristineRef.current) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }
    window.addEventListener('beforeunload', preventNavigation, false)

    return () => {
      window.removeEventListener('beforeunload', preventNavigation)
    }
  }, [])

  React.useEffect(() => {
    const unblock = history.block((location) => {
      if (!pristineRef.current) {
        const confirmLeaving = async () => {
          const hasConfirmed = await confirm(
            t('decorators.preventLeaving.message')
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
      pristineRef.current = state.pristine
    }

    return form.subscribe(subscriber, {
      pristine: true,
    })
  }, [])
}
