import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/admin',
  '/onboarding',
  '/checkout'
]

// Paths that require subscription
const subscriptionRequiredPaths = [
  '/dashboard/websites',
  '/dashboard/analytics',
  '/dashboard/reports',
  '/dashboard/settings',
  '/dashboard/billing',
  '/dashboard/support'
]

// Admin-only paths
const adminPaths = [
  '/admin'
]

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  const path = request.nextUrl.pathname
  
  // Handle subdomain routing first
  if (hostname.includes('admin.agistaffers.com') || hostname.includes('admin.localhost')) {
    // Admin subdomain
    if (url.pathname === '/') {
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    if (url.pathname === '/login') {
      url.pathname = '/admin/login'
      return NextResponse.rewrite(url)
    }
  }
  
  // Check if path requires protection
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  )
  
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Get session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Redirect to login if no session
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }

  // Check admin access - ONLY iradwatkins@gmail.com can access /admin
  if (path.startsWith('/admin')) {
    // Check if user is the system admin
    const userEmail = token.email as string
    const systemAdminEmail = 'iradwatkins@gmail.com' // ONLY system admin
    
    if (userEmail !== systemAdminEmail) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Check subscription for certain dashboard paths
  const requiresSubscription = subscriptionRequiredPaths.some(subPath => 
    path.startsWith(subPath)
  )

  if (requiresSubscription) {
    // Here you would check if the user has an active subscription
    // For now, we'll check if they have a customer record
    // In production, you'd query the database for active subscription
    
    // TODO: Implement actual subscription check
    // const hasSubscription = await checkUserSubscription(token.sub)
    
    // For now, allow access but you can implement the check later
    const hasSubscription = true // Placeholder - will be replaced with actual check
    
    if (!hasSubscription) {
      // Redirect to subscription selection if no active subscription
      return NextResponse.redirect(new URL('/onboarding/subscription', request.url))
    }
  }

  // Special handling for checkout page
  if (path === '/checkout') {
    // Check if there's a selected plan (from sessionStorage via API call would be better)
    // For now, just ensure they're authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/onboarding/subscription', request.url))
    }
  }
  
  // Allow authenticated requests to continue
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}