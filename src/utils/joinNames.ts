const joinNames = (
  path: string,
  newName: string | number | undefined
): string => {
  if (!newName && newName !== 0) {
    return path
  }

  if (!path) {
    return `${newName}`
  }

  if (typeof newName === 'number') {
    return `${path}[${newName}]`
  }

  return `${path}.${newName}`
}

export default joinNames
