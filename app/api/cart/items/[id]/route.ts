import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// PATCH /api/cart/items/[id] - Update cart item quantity
export const PATCH = requireAuth(async (request: NextRequest, user, context) => {
    try {
        const { id } = context.params as { id: string }
        const body = await request.json()
        const { quantity } = body

        if (!quantity || quantity < 1) {
            return NextResponse.json(
                { success: false, error: 'Quantity must be at least 1' },
                { status: 400 }
            )
        }

        // Find cart item
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

        // Verify cart belongs to user
        if (cartItem.cart.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Check stock
        if (cartItem.product.stock < quantity) {
            return NextResponse.json(
                { success: false, error: `Only ${cartItem.product.stock} items available in stock` },
                { status: 400 }
            )
        }

        // Update quantity
        await prisma.cartItem.update({
            where: { id },
            data: { quantity },
        })

        // Fetch updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cartItem.cartId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                                brand: true,
                            },
                        },
                    },
                },
            },
        })

        const subtotal = updatedCart!.items.reduce((sum, item) => {
            const price = item.product.salePrice || item.product.price
            return sum + Number(price) * item.quantity
        }, 0)

        return NextResponse.json({
            success: true,
            data: {
                ...updatedCart,
                subtotal,
                itemCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0),
            },
            message: 'Cart updated',
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
export const DELETE = requireAuth(async (request: NextRequest, user, context) => {
    try {
        const { id } = context.params as { id: string }

        // Find cart item
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

        // Verify cart belongs to user
        if (cartItem.cart.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Delete item
        await prisma.cartItem.delete({
            where: { id },
        })

        // Fetch updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cartItem.cartId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                                brand: true,
                            },
                        },
                    },
                },
            },
        })

        const subtotal = updatedCart!.items.reduce((sum, item) => {
            const price = item.product.salePrice || item.product.price
            return sum + Number(price) * item.quantity
        }, 0)

        return NextResponse.json({
            success: true,
            data: {
                ...updatedCart,
                subtotal,
                itemCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0),
            },
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
