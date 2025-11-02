import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  trustHost: true, // Fix UntrustedHost error
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      
      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign in
      // The middleware will handle admin vs client routing based on email
      if (url === baseUrl + '/login' || url === baseUrl || url.includes('/api/auth/callback')) {
        return baseUrl + '/dashboard'
      }
      
      // If coming from admin login, go to admin
      if (url.includes('/admin/login')) {
        return baseUrl + '/admin'
      }
      
      return url
    },
  },
  providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig