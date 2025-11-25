import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyOTP } from '@/lib/auth/otp'
import { generateAccessToken } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, otp, type } = body

        // Validate input
        if (!email || !otp || !type) {
            return NextResponse.json(
                { success: false, error: 'Email, OTP, and type are required' },
                { status: 400 }
            )
        }

        // Validate type
        if (type !== 'EMAIL_VERIFICATION' && type !== 'PASSWORD_RESET') {
            return NextResponse.json(
                { success: false, error: 'Invalid verification type' },
                { status: 400 }
            )
        }

        // Verify OTP
        const verification = await verifyOTP(email, otp, type)

        if (!verification.valid) {
            return NextResponse.json(
                { success: false, error: verification.message || 'Invalid OTP' },
                { status: 400 }
            )
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // For email verification, update emailVerified
        if (type === 'EMAIL_VERIFICATION') {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            })
        }

        // Generate JWT token
        const token = generateAccessToken(user.id, user.email, user.role)

        return NextResponse.json({
            success: true,
            message: 'Verification successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: type === 'EMAIL_VERIFICATION' ? new Date() : user.emailVerified,
            },
        })

    } catch (error) {
        console.error('OTP verification error:', error)
        return NextResponse.json(
            { success: false, error: 'Verification failed. Please try again.' },
            { status: 500 }
        )
    }
}
