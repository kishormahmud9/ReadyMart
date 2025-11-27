import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// GET /api/cart - Get current user's cart
export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        // Find or create cart for user
        let cart = await prisma.cart.findUnique({
            where: { userId: user.userId },
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

        if (!cart) {
            // Create empty cart if doesn't exist
            cart = await prisma.cart.create({
                data: {
                    userId: user.userId,
                },
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
        }

        // Calculate totals
        const subtotal = cart.items.reduce((sum, item) => {
            const price = item.product.salePrice || item.product.price
            return sum + Number(price) * item.quantity
        }, 0)

        return NextResponse.json({
            success: true,
            data: {
                ...cart,
                subtotal,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
            },
        })
    } catch (error) {
        console.error('Error fetching cart:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch cart' },
            { status: 500 }
        )
    }
})

// POST /api/cart - Add item to cart
export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { productId, quantity = 1 } = body

        if (!productId) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            )
        }

        if (quantity < 1) {
            return NextResponse.json(
                { success: false, error: 'Quantity must be at least 1' },
                { status: 400 }
            )
        }

        // Check if product exists and has stock
        const product = await prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product || product.isArchived) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            )
        }

        if (product.stock < quantity) {
            return NextResponse.json(
                { success: false, error: 'Insufficient stock' },
                { status: 400 }
            )
        }

        // Find or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId: user.userId },
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: user.userId,
                },
            })
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
            },
        })

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity

            if (product.stock < newQuantity) {
                return NextResponse.json(
                    { success: false, error: 'Insufficient stock' },
                    { status: 400 }
                )
            }

            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            })
        } else {
            // Add new item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            })
        }

        // Fetch updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
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
            message: 'Item added to cart',
        })
    } catch (error) {
        console.error('Error adding to cart:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to add to cart' },
            { status: 500 }
        )
    }
})
