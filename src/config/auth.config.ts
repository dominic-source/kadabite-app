import { NextAuthConfig } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { nextLogin, googleAuth } from '~/actions/nextauth'
import { inDevEnvironment } from '~/utils'
import { LoginSchema } from '~/schemas'
import { CustomJWT, CustomSession } from '~/types'
import { encode } from 'next-auth/jwt'

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)
        if (!validatedFields.success) {
          return null
        }
        const { email, password, rememberMe } = validatedFields.data
        const response = await nextLogin({ email, password, rememberMe })
        if (!response || !('data' in response)) {
          return null
        }
        const user = response.data as CustomJWT
        user.access_token = response.access_token
        return user
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  debug: inDevEnvironment,
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === 'google' && profile?.email) {
        return true
      }
      if (account?.provider === 'twitter') {
        return true
      }
      return !!user
    },
    async jwt({ token, user, account }) {
      // When signing in with Google, call googleAuth to send the backend login request.
      if (account?.provider === 'google') {
        // Verify that all required properties exist
        if (!account.id_token || !account.access_token || !user?.email) {
          console.error('Missing required fields for googleAuth')
          return token
        }
      }
      return {
        ...token,
        ...user,
      } as CustomJWT
    },
    async session({ session, token }: { session: CustomSession; token: JWT }) {
      const customToken = token as CustomJWT
      if (!customToken || !customToken.id) {
        return {
          ...session,
          user: {
            id: '',
            first_name: '',
            last_name: '',
            email: '',
            image: '',
          },
          access_token: undefined,
          jwt_token: undefined,
          userOrg: undefined,
          currentOrgId: undefined,
          expires: new Date(0).toISOString(),
        }
      }

      // Set token expiration to the session expiration
      const sessionExp = new Date(session.expires)

      let jwtToken
      const nameArray = (customToken.name || '').split(' ')
      try {
        // Encode the JWT token with the customToken data
        jwtToken = await encode({
          token: {
            sub: customToken.id,
            email: customToken.email,
            access_token: customToken.access_token,
            exp: Math.floor(sessionExp.getTime() / 1000),
          },
          secret: process.env.AUTH_SECRET!,
          salt: '',
        })

        // Only call googleAuth for Google provider
        if (customToken.provider === 'google') {
          const argObj = {
            jwt_token: jwtToken,
            email: customToken.email,
            first_name: nameArray[0] || '',
            last_name:
              nameArray.length > 1 ? nameArray[nameArray.length - 1] : '',
            middle_name:
              nameArray.length > 2 ? nameArray.slice(1, -1).join(' ') : '',
            avatar_url: customToken.avatar_url,
          }
          const googleRes = await googleAuth(argObj)
          if (googleRes.success) {
            session.jwt_token = jwtToken
          } else {
            console.error('googleAuth backend login failed:', googleRes.message)
          }
        } else {
          // For other providers, just set the jwt_token
          session.jwt_token = jwtToken
        }
      } catch (error) {
        console.error('Error encoding JWT token:', error)
      }
      session.user = {
        id: customToken.id as string,
        first_name: nameArray[0] || '',
        last_name: nameArray.length > 1 ? nameArray[nameArray.length - 1] : '',
        middle_name:
          nameArray.length > 2 ? nameArray.slice(1, -1).join(' ') : '',
        image: customToken.avatar_url || '',
        email: customToken.email as string,
      }
      session.access_token = customToken.access_token
      session.userOrg = customToken.organisations
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig
