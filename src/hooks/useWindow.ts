import { useState, useEffect } from 'react'

function useWindowSize() {
  const isClient = typeof window === 'object' // Verifica se estamos no lado do cliente

  const [windowSize, setWindowSize] = useState({
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined
  })

  useEffect(() => {
    function updateWindowSize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()

    return () => {
      window.removeEventListener('resize', updateWindowSize)
    }
  }, [])
  return windowSize
}

export default useWindowSize
