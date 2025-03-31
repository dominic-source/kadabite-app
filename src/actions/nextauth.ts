'use server'

import * as z from 'zod'
import { LoginSchema } from '~/schemas'
import { getBaseURL } from './getenv'
import { createFetchUtil, HttpError } from './fetchutil'
import { User, MyGoogleAuth } from '~/types'
import { cookies } from 'next/headers'

interface LoginResponse {
  user: User
  access_token: string
}

export const nextLogin = async (values: z.infer<typeof LoginSchema>) => {
  const cookieStore = await cookies()
  const backend = cookieStore.get('backend')?.value
  const baseURL = await getBaseURL(backend)

  if (!baseURL) {
    return {
      status: 500,
      message: 'Base URL not defined',
      success: true,
    }
  }
  const api = createFetchUtil({ baseUrl: baseURL })

  const response = await api<{ data: LoginResponse; access_token: string }>(
    '/auth/login',
    {
      method: 'POST',
      body: values,
    }
  )

  return {
    data: response.data.user,
    access_token: response.access_token,
    success: true,
  }
}

export const googleAuth = async (args: MyGoogleAuth) => {
  const cookieStore = await cookies()
  const backend = cookieStore.get('backend')?.value
  const baseURL = await getBaseURL(backend)
  if (!baseURL) {
    return {
      status: 500,
      message: 'Base URL not defined',
      success: true,
    }
  }
  const api = createFetchUtil({ baseUrl: baseURL })

  try {
    // Send a backend request (GraphQL mutation) to complete third-party login.
    const graphqlQuery: {
      query: string
      variables: {
        email?: string
        firstName?: string
        lastName?: string
        middleName?: string
        imageUrl?: string
      }
    } = {
      query: `
        mutation thirdPartyLogin($email: String!, $firstName: String!, $lastName: String!, $middleName: String, $imageUrl: String) {
          thirdPartyLogin(email: $email, firstName: $firstName, lastName: $lastName, middleName: $middleName, imageUrl: $imageUrl) {
            ok
            message
            statusCode
          }
        }
      `,
      variables: {
        email: args.email,
        firstName: args.first_name,
        lastName: args.last_name,
        imageUrl: args.avatar_url,
      },
    }

    const res = await api<{ data: LoginResponse }>('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${args.jwt_token}`,
      },
      body: JSON.stringify(graphqlQuery),
    })
    return {
      data: res.data,
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid form data',
        errors: error.errors,
      }
    } else if (error instanceof HttpError) {
      console.error(
        'HTTP Error:',
        error.message,
        'Status:',
        error.response.status
      )
      return {
        success: false,
        message:
          error.responseBody?.message || `Server error: ${error.message}`,
        statusCode: error.statusCode,
        responseBody: error.responseBody,
      }
    } else {
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
}

export const setBackend = async (backend?: string) => {
  const cookieStore = await cookies()
  if (backend) {
    cookieStore.set('backend', backend)
  }

  return {
    sucess: true,
  }
}
