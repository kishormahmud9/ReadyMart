import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
})

// POST /api/payment/create-intent - Create PaymentIntent for an order
export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { orderId } = body

        if (!orderId) {
            return NextResponse.json(
                { success: false, error: 'Order ID is required' },
                { status: 400 }
            )
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
        })

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            )
        }

        if (order.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.totalAmount) * 100), // Amount in cents
            currency: 'usd',
            metadata: {
                orderId: order.id,
                userId: user.userId,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        })
    } catch (error) {
        console.error('Error creating payment intent:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create payment intent' },
            { status: 500 }
        )
    }
})
