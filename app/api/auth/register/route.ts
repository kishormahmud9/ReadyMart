import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePassword } from '@/lib/auth/password'
import { createVerificationToken } from '@/lib/auth/otp'
import { sendVerificationEmail } from '@/lib/email/mailer'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password } = body

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Validate password strength
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { success: false, error: passwordValidation.message },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'Email already registered' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        })

        // Generate OTP
        const otp = await createVerificationToken(email, 'EMAIL_VERIFICATION')

        // Send verification email
        const emailResult = await sendVerificationEmail(email, otp)

        if (!emailResult.success) {
            console.error('Failed to send verification email:', emailResult.error)
            // Don't fail registration if email fails, user can request resend
        }

        return NextResponse.json({
            success: true,
            message: 'Registration successful. Please check your email for OTP verification.',
            data: {
                userId: user.id,
                email: user.email,
            },
        }, { status: 201 })

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Registration failed. Please try again.' },
            { status: 500 }
        )
    }
}
