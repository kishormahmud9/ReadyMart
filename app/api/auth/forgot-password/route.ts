import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createVerificationToken } from '@/lib/auth/otp'
import { sendPasswordResetEmail } from '@/lib/email/mailer'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        // Validate input
        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            )
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Don't reveal if user exists or not for security
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset OTP.',
            })
        }

        // Generate OTP
        const otp = await createVerificationToken(email, 'PASSWORD_RESET')

        // Send password reset email
        const emailResult = await sendPasswordResetEmail(email, otp)

        if (!emailResult.success) {
            console.error('Failed to send password reset email:', emailResult.error)
            return NextResponse.json(
                { success: false, error: 'Failed to send reset email. Please try again.' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Password reset OTP sent to your email.',
        })

    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to process request. Please try again.' },
            { status: 500 }
        )
    }
}
