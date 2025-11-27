import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// GET /api/orders - Get user's orders
export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const [orders, totalCount] = await Promise.all([
            prisma.order.findMany({
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
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.order.count({
                where: { userId: user.userId },
            }),
        ])

        const totalPages = Math.ceil(totalCount / limit)

        return NextResponse.json({
            success: true,
            data: orders,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        })
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
})

// POST /api/orders - Create order from cart
export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { shippingAddress } = body

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode || !shippingAddress.country) {
            return NextResponse.json(
                { success: false, error: 'Complete shipping address is required' },
                { status: 400 }
            )
        }

        // Get user's cart with items
        const cart = await prisma.cart.findUnique({
            where: { userId: user.userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Cart is empty' },
                { status: 400 }
            )
        }

        // Validate stock for all items
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                return NextResponse.json(
                    { success: false, error: `Insufficient stock for ${item.product.name}` },
                    { status: 400 }
                )
            }
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((sum, item) => {
            const price = item.product.salePrice || item.product.price
            return sum + Number(price) * item.quantity
        }, 0)

        // Generate order number
        const orderNumber = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

        // Create address first
        const address = await prisma.address.create({
            data: {
                userId: user.userId,
                type: 'SHIPPING',
                street: shippingAddress.street,
                city: shippingAddress.city,
                state: shippingAddress.state || '',
                zipCode: shippingAddress.zipCode,
                country: shippingAddress.country,
                isDefault: false,
            },
        })

        // Create order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    userId: user.userId,
                    orderNumber,
                    totalAmount,
                    shippingAddressId: address.id,
                    status: 'PENDING',
                    paymentStatus: 'PENDING',
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.salePrice || item.product.price,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            })

            // Update product stock
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                })
            }

            // Clear cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            })

            return newOrder
        })

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order created successfully',
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        )
    }
})
