import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import MainNav from '@/components/navigation/MainNav'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AGI Staffers - AI Solutions for Your Business',
  description: 'Transform your business with AI Assistant Subscriptions, Automation Services, AI SEO, and Custom AI Prompts. Scale smarter, not harder.',
  keywords: ['AI assistants', 'AI automation', 'AI SEO', 'custom AI prompts', 'business automation'],
  authors: [{ name: 'AGI Staffers' }],
  openGraph: {
    title: 'AGI Staffers - AI Solutions for Your Business',
    description: 'Transform your business with AI-powered solutions',
    url: 'https://agistaffers.com',
    siteName: 'AGI Staffers',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <MainNav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
