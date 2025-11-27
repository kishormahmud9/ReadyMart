import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAccessToken } from './jwt'
import { prisma } from '../prisma'

export interface CurrentUser {
    id: string
    email: string
    name: string | null
    role: string
}

/**
 * Get current user from cookies (for use in App Router server components/actions)
 */
export async function getCurrentUser(request?: NextRequest): Promise<CurrentUser | null> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('accessToken')?.value

        if (!accessToken) {
            return null
        }

        const payload = verifyAccessToken(accessToken)

        if (!payload) {
            return null
        }

        // Fetch full user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        })

        if (!user) {
            return null
        }

        return user
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}

/**
 * Get current user from request headers (for API routes)
 */
export async function getCurrentUserFromRequest(request: NextRequest): Promise<CurrentUser | null> {
    try {
        // Try to get from Cookie header first
        const cookies = request.cookies
        const accessToken = cookies.get('accessToken')?.value

        if (!accessToken) {
            return null
        }

        const payload = verifyAccessToken(accessToken)

        if (!payload) {
            return null
        }

        // Fetch full user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        })

        if (!user) {
            return null
        }

        return user
    } catch (error) {
        console.error('Error getting current user from request:', error)
        return null
    }
}
