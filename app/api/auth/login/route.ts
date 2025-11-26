import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/auth/password'
import { generateTokenPair } from '@/lib/auth/jwt'
import { setAuthCookies } from '@/lib/auth/cookies'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, rememberMe = false } = body

        // Validate email
        if (!email || !email.trim()) {
            return NextResponse.json(
                { success: false, error: 'Email is required', field: 'email' },
                { status: 400 }
            )
        }

        // Validate password
        if (!password) {
            return NextResponse.json(
                { success: false, error: 'Password is required', field: 'password' },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
        })

        if (!user || !user.password) {
            return NextResponse.json(
                { success: false, error: 'No account found with this email', field: 'email' },
                { status: 401 }
            )
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: 'Incorrect password', field: 'password' },
                { status: 401 }
            )
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Please verify your email before logging in',
                    field: 'email',
                    requiresVerification: true,
                },
                { status: 403 }
            )
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = generateTokenPair(
            user.id,
            user.email,
            user.role,
            rememberMe
        )

        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
            },
        })

        // Set tokens in HTTP-only cookies
        setAuthCookies(response, accessToken, refreshToken, rememberMe)

        return response

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, error: 'Login failed. Please try again.', field: 'general' },
            { status: 500 }
        )
    }
}


