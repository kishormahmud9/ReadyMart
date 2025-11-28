import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// GET /api/wishlist - Get user's wishlist
export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const wishlist = await prisma.wishlist.findMany({
            where: { userId: user.userId },
            include: {
                product: {
                    include: {
                        category: true,
                        brand: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json({
            success: true,
            data: wishlist,
        })
    } catch (error) {
        console.error('Error fetching wishlist:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch wishlist' },
            { status: 500 }
        )
    }
})

// POST /api/wishlist - Add item to wishlist
export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { productId } = body

        if (!productId) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            )
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        })

        if (!product || product.isArchived) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            )
        }

        // Check if already in wishlist
        const existing = await prisma.wishlist.findFirst({
            where: {
                userId: user.userId,
                productId,
            },
        })

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Product already in wishlist' },
                { status: 400 }
            )
        }

        // Add to wishlist
        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId: user.userId,
                productId,
            },
            include: {
                product: {
                    include: {
                        category: true,
                        brand: true,
                    },
                },
            },
        })

        return NextResponse.json({
            success: true,
            data: wishlistItem,
            message: 'Added to wishlist',
        })
    } catch (error) {
        console.error('Error adding to wishlist:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to add to wishlist' },
            { status: 500 }
        )
    }
})
