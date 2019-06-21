import { some } from 'lodash'
import * as React from 'react'

import useUniqID from '../_internal/useUniqID'
import { StatusContext } from '../contexts'
import {
  FormSectionRenderProps,
  FormSectionStatusProps,
} from '../FormSection/FormSection.interface'

import FormSectionWatcherProps from './FormSectionWatcher.interface'

const FormSectionWatcher: React.FunctionComponent<FormSectionWatcherProps> = ({
  id,
  children,
}) => {
  const uId = useUniqID()
  const form = React.useContext(StatusContext)

  const [status, updateStatus] = React.useState<FormSectionStatusProps>({
    dirty: {},
    error: {},
  })

  const renderPropsStatus: FormSectionRenderProps = React.useMemo(
    () => ({
      hasError: some(status.error, el => !!el),
      isDirty: some(status.dirty, el => !!el),
    }),
    [status]
  )

  React.useLayoutEffect(
    () =>
      form.subscribeSectionWatcher({
        uId,
        id,
        callback: (fieldID, type, value) => {
          updateStatus(prev => ({
            ...prev,
            [type]: { ...prev[type], [fieldID]: value },
          }))
        },
      }),
    [id, uId] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return children(renderPropsStatus)
}

export default FormSectionWatcher
