import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/middleware'

// GET /api/brands/[id] - Get single brand (public)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        const brand = await prisma.brand.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        })

        if (!brand) {
            return NextResponse.json(
                { success: false, error: 'Brand not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: brand,
        })
    } catch (error) {
        console.error('Error fetching brand:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch brand' },
            { status: 500 }
        )
    }
}

// PUT /api/brands/[id] - Update brand (Admin only)
export const PUT = requireAdmin(async (
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

        const brand = await prisma.brand.update({
            where: { id },
            data: body,
        })

        return NextResponse.json({
            success: true,
            data: brand,
            message: 'Brand updated successfully',
        })
    } catch (error) {
        console.error('Error updating brand:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update brand' },
            { status: 500 }
        )
    }
})

// DELETE /api/brands/[id] - Delete brand (Admin only)
export const DELETE = requireAdmin(async (
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

        // Check if brand has products
        const productCount = await prisma.product.count({
            where: { brandId: id },
        })

        if (productCount > 0) {
            return NextResponse.json(
                { success: false, error: 'Cannot delete brand with products' },
                { status: 400 }
            )
        }

        await prisma.brand.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Brand deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting brand:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete brand' },
            { status: 500 }
        )
    }
})
