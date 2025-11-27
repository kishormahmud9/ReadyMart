import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/middleware'

// GET /api/categories/[id] - Get single category (public)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        })

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: category,
        })
    } catch (error) {
        console.error('Error fetching category:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch category' },
            { status: 500 }
        )
    }
}

// PUT /api/categories/[id] - Update category (Admin only)
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

        const category = await prisma.category.update({
            where: { id },
            data: body,
        })

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Category updated successfully',
        })
    } catch (error) {
        console.error('Error updating category:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update category' },
            { status: 500 }
        )
    }
})

// DELETE /api/categories/[id] - Delete category (Admin only)
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

        // Check if category has products
        const productCount = await prisma.product.count({
            where: { categoryId: id },
        })

        if (productCount > 0) {
            return NextResponse.json(
                { success: false, error: 'Cannot delete category with products' },
                { status: 400 }
            )
        }

        await prisma.category.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting category:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete category' },
            { status: 500 }
        )
    }
})
