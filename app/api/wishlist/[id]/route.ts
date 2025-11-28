import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// DELETE /api/wishlist/[id] - Remove item from wishlist
export const DELETE = requireAuth(async (request: NextRequest, user, context) => {
    try {
        const { id } = context.params as { id: string }

        // Find wishlist item
        const wishlistItem = await prisma.wishlist.findUnique({
            where: { id },
        })

        if (!wishlistItem) {
            return NextResponse.json(
                { success: false, error: 'Wishlist item not found' },
                { status: 404 }
            )
        }

        // Verify ownership
        if (wishlistItem.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Delete item
        await prisma.wishlist.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Removed from wishlist',
        })
    } catch (error) {
        console.error('Error removing from wishlist:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to remove from wishlist' },
            { status: 500 }
        )
    }
})
