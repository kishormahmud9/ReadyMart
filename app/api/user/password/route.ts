import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'
import { comparePassword, hashPassword } from '@/lib/auth/password'

// PATCH /api/user/password - Change password
export const PATCH = requireAuth(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { currentPassword, newPassword, confirmPassword } = body

        // Validate required fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, error: 'New password must be at least 6 characters' },
                { status: 400 }
            )
        }

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { success: false, error: 'New passwords do not match' },
                { status: 400 }
            )
        }

        // Get user with password
        const currentUser = await prisma.user.findUnique({
            where: { id: user.userId },
        })

        if (!currentUser || !currentUser.password) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Verify current password
        const isValid = await comparePassword(currentPassword, currentUser.password)
        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Current password is incorrect' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword)

        // Update password
        await prisma.user.update({
            where: { id: user.userId },
            data: { password: hashedPassword },
        })

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully',
        })
    } catch (error) {
        console.error('Error updating password:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update password' },
            { status: 500 }
        )
    }
})
