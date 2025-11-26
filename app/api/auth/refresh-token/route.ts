import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRefreshToken, generateTokenPair } from '@/lib/auth/jwt'
import { getRefreshTokenFromRequest, setAuthCookies } from '@/lib/auth/cookies'

export async function POST(request: NextRequest) {
    try {
        // Get refresh token from cookie
        const refreshToken = getRefreshTokenFromRequest(request)

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, error: 'No refresh token provided' },
                { status: 401 }
            )
        }

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken)

        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired refresh token' },
                { status: 401 }
            )
        }

        // Check if user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        if (!user.emailVerified) {
            return NextResponse.json(
                { success: false, error: 'Email not verified' },
                { status: 403 }
            )
        }

        // Generate new token pair (token rotation for security)
        const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
            user.id,
            user.email,
            user.role,
            false // Default to session-based for refresh
        )

        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Token refreshed successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
            },
        })

        // Set new tokens in cookies
        setAuthCookies(response, accessToken, newRefreshToken, false)

        return response

    } catch (error) {
        console.error('Token refresh error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to refresh token' },
            { status: 500 }
        )
    }
}
