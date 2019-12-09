import * as React from 'react'

export default interface FormHelperProviderProps {
  errors: {
    color: string
    component: React.ComponentType<{ padding?: number }>
  }
}
