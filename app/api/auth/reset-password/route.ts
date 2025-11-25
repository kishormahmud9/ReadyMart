import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyOTP } from '@/lib/auth/otp'
import { hashPassword, validatePassword } from '@/lib/auth/password'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, otp, newPassword } = body

        // Validate input
        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { success: false, error: 'Email, OTP, and new password are required' },
                { status: 400 }
            )
        }

        // Validate password strength
        const passwordValidation = validatePassword(newPassword)
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { success: false, error: passwordValidation.message },
                { status: 400 }
            )
        }

        // Verify OTP
        const verification = await verifyOTP(email, otp, 'PASSWORD_RESET')

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

        // Hash new password
        const hashedPassword = await hashPassword(newPassword)

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        })

        return NextResponse.json({
            success: true,
            message: 'Password reset successful. Please login with your new password.',
        })

    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { success: false, error: 'Password reset failed. Please try again.' },
            { status: 500 }
        )
    }
}
