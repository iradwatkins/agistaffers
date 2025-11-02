'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function useAutoTheme() {
  const { theme, setTheme, systemTheme } = useTheme()

  useEffect(() => {
    // Check if user has manually set a theme preference
    const userPreference = localStorage.getItem('user-theme-preference')
    
    if (!userPreference || userPreference === 'auto') {
      // Auto mode: switch based on time of day
      const checkTimeAndSetTheme = () => {
        const hour = new Date().getHours()
        
        // Dark theme from 7 PM to 7 AM (19:00 - 07:00)
        // Light theme from 7 AM to 7 PM (07:00 - 19:00)
        const shouldBeDark = hour >= 19 || hour < 7
        
        const currentTheme = theme === 'system' ? systemTheme : theme
        const targetTheme = shouldBeDark ? 'dark' : 'light'
        
        if (currentTheme !== targetTheme) {
          setTheme(targetTheme)
        }
      }

      // Check immediately
      checkTimeAndSetTheme()

      // Check every minute to catch the transition times
      const interval = setInterval(checkTimeAndSetTheme, 60000)

      return () => clearInterval(interval)
    }
  }, [theme, setTheme, systemTheme])

  // Function to override auto theme (when user manually selects)
  const setUserTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    if (newTheme === 'auto') {
      localStorage.removeItem('user-theme-preference')
      // Immediately apply auto theme
      const hour = new Date().getHours()
      const shouldBeDark = hour >= 19 || hour < 7
      setTheme(shouldBeDark ? 'dark' : 'light')
    } else {
      localStorage.setItem('user-theme-preference', newTheme)
      setTheme(newTheme)
    }
  }

  return { setUserTheme }
}