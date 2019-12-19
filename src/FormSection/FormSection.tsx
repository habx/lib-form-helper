import { isFunction, some } from 'lodash'
import * as React from 'react'

import useSSRLayoutEffect from '../_internal/useSSRLayoutEffect'
import useUniqID from '../_internal/useUniqID'
import { StatusContext, SectionContext } from '../contexts'
import joinNames from '../joinNames'

import FormSectionProps, {
  FormSectionStatusProps,
  FormSectionRenderProps,
} from './FormSection.interface'

const FormSection: React.FunctionComponent<FormSectionProps> = ({
  id,
  name,
  rootName,
  children,
}) => {
  const uniqID = useUniqID()
  const form = React.useContext(StatusContext)
  const parentSection = React.useContext(SectionContext)
  const [status, updateStatus] = React.useState<FormSectionStatusProps>({
    dirty: {},
    error: {},
  })

  const sectionsPath = React.useMemo(() => [...parentSection.path, uniqID], [
    parentSection.path,
    uniqID,
  ])

  const sectionContext = React.useMemo(
    () => ({
      name: rootName ? rootName : joinNames(parentSection.name, name),
      path: sectionsPath,
    }),
    [rootName, parentSection.name, name, sectionsPath]
  )

  const renderPropsStatus: FormSectionRenderProps = React.useMemo(
    () => ({
      hasError: some(status.error, el => !!el),
      isDirty: some(status.dirty, el => !!el),
    }),
    [status]
  )

  useSSRLayoutEffect(
    () =>
      form.subscribeSection(uniqID, {
        id,
        callback: (fieldID, type, value) => {
          updateStatus(prev => ({
            ...prev,
            [type]: { ...prev[type], [fieldID]: value },
          }))
        },
      }),
    [id, uniqID] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <SectionContext.Provider value={sectionContext}>
      {isFunction(children) ? children(renderPropsStatus) : children}
    </SectionContext.Provider>
  )
}

export default FormSection
