import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth/cookies'

export async function POST() {
    try {
        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Logged out successfully',
        })

        // Clear authentication cookies
        clearAuthCookies(response)

        return response

    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { success: false, error: 'Logout failed' },
            { status: 500 }
        )
    }
}
