import { Decorator } from 'final-form'
import * as React from 'react'

export const useFormKeyboardSubmitDecorator = () =>
  React.useCallback<Decorator<any, any>>((form) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()

        if (!form.getState().submitting) {
          form.submit()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
