import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from './jwt'
import { prisma } from '../prisma'

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        userId: string
        email: string
        role: string
    }
}

/**
 * Authenticate request and extract user from JWT token
 */
export async function authenticate(request: NextRequest): Promise<{
    success: boolean
    user?: {
        userId: string
        email: string
        role: string
    }
    error?: string
}> {
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
        return { success: false, error: 'No token provided' }
    }

    const payload = verifyToken(token)

    if (!payload) {
        return { success: false, error: 'Invalid or expired token' }
    }

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    })

    if (!user) {
        return { success: false, error: 'User not found' }
    }

    return {
        success: true,
        user: {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        },
    }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(
    handler: (request: NextRequest, user: { userId: string; email: string; role: string }) => Promise<NextResponse>
) {
    return async (request: NextRequest) => {
        const auth = await authenticate(request)

        if (!auth.success || !auth.user) {
            return NextResponse.json(
                { success: false, error: auth.error || 'Authentication required' },
                { status: 401 }
            )
        }

        return handler(request, auth.user)
    }
}

/**
 * Middleware to require admin role
 */
export function requireAdmin(
    handler: (request: NextRequest, user: { userId: string; email: string; role: string }) => Promise<NextResponse>
) {
    return async (request: NextRequest) => {
        const auth = await authenticate(request)

        if (!auth.success || !auth.user) {
            return NextResponse.json(
                { success: false, error: auth.error || 'Authentication required' },
                { status: 401 }
            )
        }

        if (auth.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Admin access required' },
                { status: 403 }
            )
        }

        return handler(request, auth.user)
    }
}
