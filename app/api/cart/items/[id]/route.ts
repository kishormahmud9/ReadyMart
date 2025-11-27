import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// PUT /api/cart/items/[id] - Update cart item quantity
export const PUT = requireAuth(async (
    request: NextRequest,
    user,
    context?: { params: { id: string } }
) => {
    try {
        if (!context) {
            return NextResponse.json(
                { success: false, error: 'Invalid request' },
                { status: 400 }
            )
        }

        const { id } = await context.params
        const body = await request.json()
        const { quantity } = body

        if (typeof quantity !== 'number' || quantity < 1) {
            return NextResponse.json(
                { success: false, error: 'Quantity must be at least 1' },
                { status: 400 }
            )
        }

        // Find cart item and verify ownership
        const cartItem = await prisma.cartItem.findUnique({
            where: { id },
            include: {
                cart: true,
                product: true,
            },
        })

        if (!cartItem) {
            return NextResponse.json(
                { success: false, error: 'Cart item not found' },
                { status: 404 }
            )
        }

        if (cartItem.cart.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Check stock availability
        if (cartItem.product.stock < quantity) {
            return NextResponse.json(
                { success: false, error: 'Insufficient stock' },
                { status: 400 }
            )
        }

        // Update quantity
        await prisma.cartItem.update({
            where: { id },
            data: { quantity },
        })

        return NextResponse.json({
            success: true,
            message: 'Cart item updated',
        })
    } catch (error) {
        console.error('Error updating cart item:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update cart item' },
            { status: 500 }
        )
    }
})

// DELETE /api/cart/items/[id] - Remove item from cart
export const DELETE = requireAuth(async (
    request: NextRequest,
    user,
    context?: { params: { id: string } }
) => {
    try {
        if (!context) {
            return NextResponse.json(
                { success: false, error: 'Invalid request' },
                { status: 400 }
            )
        }

        const { id } = await context.params

        // Find cart item and verify ownership
        const cartItem = await prisma.cartItem.findUnique({
            where: { id },
            include: {
                cart: true,
            },
        })

        if (!cartItem) {
            return NextResponse.json(
                { success: false, error: 'Cart item not found' },
                { status: 404 }
            )
        }

        if (cartItem.cart.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Delete cart item
        await prisma.cartItem.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Item removed from cart',
        })
    } catch (error) {
        console.error('Error removing cart item:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to remove cart item' },
            { status: 500 }
        )
    }
})
