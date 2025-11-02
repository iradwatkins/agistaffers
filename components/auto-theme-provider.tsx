'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function AutoThemeProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme()

  useEffect(() => {
    // Check if user has set a preference
    const userPreference = localStorage.getItem('agi-theme')
    
    // If no preference or set to system, apply time-based theme
    if (!userPreference || userPreference === 'system') {
      const checkTimeAndSetTheme = () => {
        const hour = new Date().getHours()
        // Dark theme from 7 PM to 7 AM (19:00 - 07:00)
        // Light theme from 7 AM to 7 PM (07:00 - 19:00)
        const shouldBeDark = hour >= 19 || hour < 7
        setTheme(shouldBeDark ? 'dark' : 'light')
      }
      
      // Check immediately
      checkTimeAndSetTheme()
      
      // Check every minute
      const interval = setInterval(checkTimeAndSetTheme, 60000)
      
      return () => clearInterval(interval)
    }
  }, [setTheme])

  return <>{children}</>
}