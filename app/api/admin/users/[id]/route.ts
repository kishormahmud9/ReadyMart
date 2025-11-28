import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/middleware'

// GET /api/admin/users/[id] - Get user details
export const GET = requireAdmin(async (
    request: NextRequest,
    user,
    context?: { params: { id: string } }
) => {
    try {
        if (!context) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        const { id } = await context.params

        const userDetails = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        orderNumber: true,
                        totalAmount: true,
                        status: true,
                        createdAt: true,
                    },
                },
                addresses: true,
                _count: {
                    select: {
                        orders: true,
                        reviews: true,
                    },
                },
            },
        })

        if (!userDetails) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: userDetails,
        })
    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user' },
            { status: 500 }
        )
    }
})

// PATCH /api/admin/users/[id] - Update user role (Admin only)
export const PATCH = requireAdmin(async (
    request: NextRequest,
    user,
    context?: { params: { id: string } }
) => {
    try {
        if (!context) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        const { id } = await context.params
        const body = await request.json()
        const { role } = body

        if (!role || !['USER', 'ADMIN'].includes(role)) {
            return NextResponse.json(
                { success: false, error: 'Invalid role' },
                { status: 400 }
            )
        }

        // Prevent changing own role
        if (id === user.userId) {
            return NextResponse.json(
                { success: false, error: 'Cannot change your own role' },
                { status: 400 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
        })

        return NextResponse.json({
            success: true,
            data: updatedUser,
            message: 'User role updated successfully',
        })
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update user' },
            { status: 500 }
        )
    }
})
