'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function FooterWrapper() {
  const pathname = usePathname()
  
  // Newsletter should ONLY appear on the main public home page
  // Hide it on admin, dashboard, style-guide, and all other pages
  const showNewsletter = pathname === '/' || pathname === '/about' || pathname === '/services'
  
  return <Footer showNewsletter={showNewsletter} />
}