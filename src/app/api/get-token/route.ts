import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  // Check for both auth tokens (regular auth token and Google OAuth tokens)
  const authToken = cookieStore.get('authToken')
  const accessToken = cookieStore.get('accessToken') // Google OAuth access token
  const refreshToken = cookieStore.get('refreshToken') // Google OAuth refresh token

  const origin = request.headers.get('origin')

  // Validate the origin
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : []

  if (!origin || !allowedOrigins.includes(origin)) {
    return new NextResponse(null, { status: 403 })
  }

  // If we have neither token type, return an error
  if (!authToken && !accessToken) {
    return NextResponse.json(
      { error: 'No authentication token found' },
      {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    )
  }

  // If we have an OAuth token but no regular auth token, handle the refresh flow if needed
  if (!authToken && accessToken && refreshToken) {
    // Check if the access token is expired (you may need to implement this check)
    const isAccessTokenExpired = false // Placeholder - implement actual check

    if (isAccessTokenExpired) {
      try {
        // Refresh the token
        const refreshResponse = await fetch(
          'https://oauth2.googleapis.com/token',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              refresh_token: refreshToken.value,
              client_id: process.env.GOOGLE_CLIENT_ID || '',
              client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
              grant_type: 'refresh_token',
            }).toString(),
          }
        )

        if (refreshResponse.ok) {
          const newTokens = await refreshResponse.json()

          // Return the new access token
          return NextResponse.json(
            { accessToken: newTokens.access_token },
            {
              status: 200,
              headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Credentials': 'true',
                // You would need to update cookies here as well
              },
            }
          )
        }
      } catch (error) {
        console.error('Error refreshing token:', error)
      }
    }
  }

  // Return the available token (prioritize regular auth token if both exist)
  return NextResponse.json(
    {
      authToken: authToken?.value,
      accessToken: accessToken?.value,
      // Don't return refresh token for security reasons
    },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  )
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : []

  if (!origin || !allowedOrigins.includes(origin)) {
    return new NextResponse(null, { status: 403 })
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  })
}
