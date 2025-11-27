import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// GET /api/orders/[id] - Get single order details
export const GET = requireAuth(async (
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

        const order = await prisma.order.findUnique({
            where: { id },
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
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            )
        }

        // Verify ownership (unless admin in the future)
        if (order.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Fetch shipping address if exists
        let shippingAddress = null
        if (order.shippingAddressId) {
            shippingAddress = await prisma.address.findUnique({
                where: { id: order.shippingAddressId },
            })
        }

        return NextResponse.json({
            success: true,
            data: {
                ...order,
                shippingAddress,
            },
        })
    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
            { status: 500 }
        )
    }
})
