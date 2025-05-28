'use server'

import * as z from 'zod'
import { LoginSchema } from '~/schemas'
import { getBaseURL } from './getenv'
import { createFetchUtil, HttpError } from './fetchutil'
import { User, MyGoogleAuth } from '~/types'
import { cookies } from 'next/headers'

interface LoginResponse {
  user?: User
  access_token?: string
  refresh_token?: string
  success?: boolean
  message?: string
  statusCode?: number
  ok?: boolean
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

  try {
    // Send a backend request (GraphQL mutation) to complete third-party login.
    const graphqlQuery: {
      query: string
      variables: {
        email: string
        password: string
      }
    } = {
      //  login(email: String!, password: String!)
      query: `
        mutation login($email: String!, $password: String!) {
          login(email: $email, $password: $password) {
            ok
            message
            statusCode
            token
            refreshToken
          }
        }
      `,
      variables: {
        email: values.email || '',
        password: values.password || '',
      },
    }

    const response = await api<{ data: LoginResponse }>('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: graphqlQuery,
    })
    if (response.data.ok !== true) {
      throw new Error(
        `Login failed: ${response.data.message || 'Unknown error'}`
      )
    }

    return {
      refresh_token: response.data.refresh_token,
      access_token: response.data.access_token,
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
        email: string
        firstName: string
        lastName: string
        middleName: string
        imageUrl: string
      }
    } = {
      query: `
        mutation thirdPartyLogin($email: String!, $firstName: String!, $lastName: String!, $middleName: String!, $imageUrl: String!) {
          thirdPartyLogin(email: $email, firstName: $firstName, lastName: $lastName, middleName: $middleName, imageUrl: $imageUrl) {
            ok
            message
            statusCode
          }
        }
      `,
      variables: {
        email: args.email || '',
        firstName: args.first_name || '',
        lastName: args.last_name || '',
        middleName: args.middle_name || '',
        imageUrl: args.avatar_url || '',
      },
    }

    const res = await api<{ data: LoginResponse }>('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${args.jwt_token}`,
      },
      body: graphqlQuery,
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
