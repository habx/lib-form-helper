import * as React from 'react'

export type InternationalStrings = {
  required?: string
  containsErrors?: string
}

export default interface FormHelperProviderProps {
  intl: InternationalStrings
  errors: {
    color: string
    component: React.ComponentType<{ padding?: number }>
  }
}
