import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt'

export async function GET(request: NextRequest) {
    try {
        // Extract token from Authorization header
        const authHeader = request.headers.get('authorization')
        const token = extractTokenFromHeader(authHeader)

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No token provided' },
                { status: 401 }
            )
        }

        // Verify token
        const payload = verifyToken(token)

        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                image: true,
                createdAt: true,
            },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            user,
        })

    } catch (error) {
        console.error('Get user error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to get user data' },
            { status: 500 }
        )
    }
}
