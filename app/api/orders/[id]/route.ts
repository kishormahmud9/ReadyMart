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

        // Verify ownership (unless admin)
        if (order.userId !== user.userId && user.role !== 'ADMIN') {
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

// PATCH /api/orders/[id] - Update order status (Admin only)
export const PATCH = requireAuth(async (
    request: NextRequest,
    user,
    context?: { params: { id: string } }
) => {
    try {
        if (user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        if (!context) {
            return NextResponse.json(
                { success: false, error: 'Invalid request' },
                { status: 400 }
            )
        }

        const { id } = await context.params
        const body = await request.json()
        const { status } = body

        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Invalid status' },
                { status: 400 }
            )
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order status updated',
        })
    } catch (error) {
        console.error('Error updating order:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        )
    }
})
