import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth/password'
import { generateAccessToken } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user || !user.password) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Please verify your email before logging in',
                    requiresVerification: true,
                },
                { status: 403 }
            )
        }

        // Generate JWT token
        const token = generateAccessToken(user.id, user.email, user.role)

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
            },
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, error: 'Login failed. Please try again.' },
            { status: 500 }
        )
    }
}
