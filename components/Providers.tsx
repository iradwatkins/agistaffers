'use client'

import { SessionProvider } from 'next-auth/react'
import { LanguageContext, useLanguageState } from '@/hooks/useLanguage'
import { ThemeProvider } from 'next-themes'

function LanguageProviderWrapper({ children }: { children: React.ReactNode }) {
  const languageState = useLanguageState()

  return (
    <LanguageContext.Provider value={languageState}>
      {children}
    </LanguageContext.Provider>
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProviderWrapper>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </LanguageProviderWrapper>
    </SessionProvider>
  )
}
