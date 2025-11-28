import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// GET /api/products/[id]/reviews - List reviews for a product
export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params

        const reviews = await prisma.review.findMany({
            where: { productId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({
            success: true,
            data: reviews,
        })
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reviews' },
            { status: 500 }
        )
    }
}

// POST /api/products/[id]/reviews - Create a review
export const POST = requireAuth(async (
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
        const { rating, comment } = body

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, error: 'Rating must be between 1 and 5' },
                { status: 400 }
            )
        }

        if (!comment || !comment.trim()) {
            return NextResponse.json(
                { success: false, error: 'Comment is required' },
                { status: 400 }
            )
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: user.userId,
                productId: id,
            },
        })

        if (existingReview) {
            return NextResponse.json(
                { success: false, error: 'You have already reviewed this product' },
                { status: 400 }
            )
        }

        // Verify user purchased the product (optional but good practice)
        // For now, we'll allow any authenticated user to review as per requirements "Allow authenticated customers to write reviews"
        // But checking purchase history is better. Let's stick to simple auth for now as per prompt.

        const review = await prisma.review.create({
            data: {
                userId: user.userId,
                productId: id,
                rating,
                comment: comment.trim(),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        })

        return NextResponse.json({
            success: true,
            data: review,
            message: 'Review submitted successfully',
        })
    } catch (error) {
        console.error('Error creating review:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to submit review' },
            { status: 500 }
        )
    }
})
