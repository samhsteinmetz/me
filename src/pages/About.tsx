// src/pages/About.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle page refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
      navigate('/me')
    }

    // Handle page visibility change with navigation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        console.log('Page refresh detected')
        navigate('/me')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [navigate])

  return (
    <div className="space-y-6">
      {/* ... rest of your component */}
      hi
    </div>
  )
}

export default About