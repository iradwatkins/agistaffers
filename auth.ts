import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { sendVerificationRequest } from '@/lib/email/magic-link'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const authOptions = {
  ...authConfig,
  trustHost: true, // Fix UntrustedHost error
  // Adapter is only used for OAuth and Magic Links, not Credentials
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          // Check if it's the admin user
          const adminUser = await prisma.adminUser.findUnique({
            where: { email: credentials.email as string }
          })

          if (!adminUser) {
            console.log('Admin user not found')
            return null
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            adminUser.passwordHash
          )

          if (!isValidPassword) {
            console.log('Invalid password')
            return null
          }

          // Create or get the user in the User table for session
          const user = await prisma.user.upsert({
            where: { email: adminUser.email },
            update: { 
              name: adminUser.name,
              isAdmin: true 
            },
            create: {
              email: adminUser.email,
              name: adminUser.name,
              isAdmin: true
            }
          })

          console.log('Auth successful for:', user.email)
          
          return {
            id: user.id,
            email: user.email!,
            name: user.name || 'Admin',
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    {
      id: 'gmail-magic-link',
      name: 'Email',
      type: 'email',
      from: process.env.GMAIL_USER,
      server: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
      maxAge: 10 * 60, // Magic links are valid for 10 minutes
      sendVerificationRequest,
    },
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-email',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }: any) {
      // When signing in with Google, ensure user record exists
      if (account?.provider === 'google' && user.email) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: { 
            name: user.name,
            // Set admin flag for system admin
            isAdmin: user.email === 'iradwatkins@gmail.com'
          },
          create: {
            email: user.email,
            name: user.name,
            // Set admin flag for system admin
            isAdmin: user.email === 'iradwatkins@gmail.com'
          }
        })
      }
      return true
    },
    async session({ session, token }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        // Add admin role to session - ONLY for system admin
        const isAdmin = session.user.email === 'iradwatkins@gmail.com'
        session.user.isAdmin = isAdmin
      }
      return session
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        // Add admin role to token - ONLY for system admin
        const isAdmin = user.email === 'iradwatkins@gmail.com'
        token.isAdmin = isAdmin
      }
      // For existing sessions, check email
      if (token.email) {
        const isAdmin = token.email === 'iradwatkins@gmail.com'
        token.isAdmin = isAdmin
      }
      return token
    },
    ...authConfig.callbacks,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions)