import { some } from 'lodash'
import * as React from 'react'

import { useSSRLayoutEffect } from '../_internal/useSSRLayoutEffect'
import { useUniqID } from '../_internal/useUniqID'
import { FormContext } from '../Form'
import {
  FormSectionRenderProps,
  FormSectionStatusProps,
} from '../FormSection/FormSection.interface'

import { FormSectionWatcherProps } from './FormSectionWatcher.interface'

export const FormSectionWatcher: React.FunctionComponent<FormSectionWatcherProps> =
  ({ id, children }) => {
    const watcherId = useUniqID()
    const form = React.useContext(FormContext)

    const [status, updateStatus] = React.useState<FormSectionStatusProps>({
      dirty: {},
      error: {},
    })

    const renderPropsStatus: FormSectionRenderProps = React.useMemo(
      () => ({
        hasError: some(status.error, (el) => !!el),
        isDirty: some(status.dirty, (el) => !!el),
      }),
      [status]
    )

    useSSRLayoutEffect(
      () =>
        form.subscribeSectionWatcher({
          watcherId,
          sectionId: id,
          callback: (fieldID, type, value) => {
            updateStatus((prev) => ({
              ...prev,
              [type]: { ...prev[type], [fieldID]: value },
            }))
          },
        }),
      [id, watcherId] // eslint-disable-line react-hooks/exhaustive-deps
    )

    return children(renderPropsStatus)
  }
