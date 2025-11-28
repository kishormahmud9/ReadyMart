import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// PATCH /api/user/profile - Update user profile
export const PATCH = requireAuth(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { name, email, image } = body

        // Validate required fields
        if (!name || !name.trim()) {
            return NextResponse.json(
                { success: false, error: 'Name is required' },
                { status: 400 }
            )
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            })

            if (existingUser) {
                return NextResponse.json(
                    { success: false, error: 'Email already taken' },
                    { status: 400 }
                )
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: user.userId },
            data: {
                name: name.trim(),
                ...(email && { email: email.toLowerCase().trim() }),
                ...(image && { image }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                emailVerified: true,
            },
        })

        return NextResponse.json({
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully',
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update profile' },
            { status: 500 }
        )
    }
})
