import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ACCESS_TOKEN_COOKIE = 'accessToken'
const REFRESH_TOKEN_COOKIE = 'refreshToken'

// Cookie options for production
const COOKIE_OPTIONS_BASE = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
}

/**
 * Set authentication cookies (access and refresh tokens)
 */
export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean = false
): NextResponse {
    // Access token - always session cookie (cleared when browser closes)
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
        ...COOKIE_OPTIONS_BASE,
        maxAge: 15 * 60, // 15 minutes in seconds
    })

    // Refresh token - persistent if remember me, session otherwise
    if (rememberMe) {
        // Persistent cookie - 30 days
        response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
            ...COOKIE_OPTIONS_BASE,
            maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        })
    } else {
        // Session cookie - 7 days but cleared on browser close
        response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
            ...COOKIE_OPTIONS_BASE,
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        })
    }

    return response
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
    response.cookies.delete(ACCESS_TOKEN_COOKIE)
    response.cookies.delete(REFRESH_TOKEN_COOKIE)
    return response
}

/**
 * Get access token from cookies (server-side)
 */
export async function getAccessTokenFromCookies(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
}

/**
 * Get refresh token from cookies (server-side)
 */
export async function getRefreshTokenFromCookies(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value
}

/**
 * Get both tokens from cookies (server-side)
 */
export async function getTokensFromCookies(): Promise<{
    accessToken?: string
    refreshToken?: string
}> {
    const cookieStore = await cookies()
    return {
        accessToken: cookieStore.get(ACCESS_TOKEN_COOKIE)?.value,
        refreshToken: cookieStore.get(REFRESH_TOKEN_COOKIE)?.value,
    }
}

/**
 * Get access token from request cookies (for API routes)
 */
export function getAccessTokenFromRequest(request: Request): string | undefined {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) return undefined

    const cookies = cookieHeader.split(';').map(c => c.trim())
    const accessTokenCookie = cookies.find(c => c.startsWith(`${ACCESS_TOKEN_COOKIE}=`))

    if (!accessTokenCookie) return undefined
    return accessTokenCookie.split('=')[1]
}

/**
 * Get refresh token from request cookies (for API routes)
 */
export function getRefreshTokenFromRequest(request: Request): string | undefined {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) return undefined

    const cookies = cookieHeader.split(';').map(c => c.trim())
    const refreshTokenCookie = cookies.find(c => c.startsWith(`${REFRESH_TOKEN_COOKIE}=`))

    if (!refreshTokenCookie) return undefined
    return refreshTokenCookie.split('=')[1]
}

/**
 * Get both tokens from request cookies (for API routes)
 */
export function getTokensFromRequest(request: Request): {
    accessToken?: string
    refreshToken?: string
} {
    return {
        accessToken: getAccessTokenFromRequest(request),
        refreshToken: getRefreshTokenFromRequest(request),
    }
}
