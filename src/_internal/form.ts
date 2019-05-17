export const joinNames = (path: string, newName: string) => {
  if (!newName) {
    return path
  }

  if (!path) {
    return newName
  }

  return `${path}.${newName}`
}
