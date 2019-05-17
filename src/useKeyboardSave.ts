import { useEffect } from 'react'

const useKeyboardSave = callback => {
  useEffect(() => {
    if (!callback) {
      return null
    }

    const handleKeyDown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        callback(e)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback])
}

export default useKeyboardSave
