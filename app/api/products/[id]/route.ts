import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/middleware'

// GET /api/products/[id] - Get single product details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                brand: true,
                attributes: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        })

        if (!product || product.isArchived) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: product,
        })
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}

// PUT /api/products/[id] - Update product (Admin only)
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

        const { attributes, ...productData } = body

        // Update product
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...productData,
                updatedAt: new Date(),
            },
            include: {
                category: true,
                brand: true,
                attributes: true,
            },
        })

        // Update attributes if provided
        if (attributes && Array.isArray(attributes)) {
            // Delete existing attributes
            await prisma.productAttribute.deleteMany({
                where: { productId: id },
            })

            // Create new attributes
            if (attributes.length > 0) {
                await prisma.productAttribute.createMany({
                    data: attributes.map((attr: { name: string; value: string }) => ({
                        productId: id,
                        name: attr.name,
                        value: attr.value,
                    })),
                })
            }
        }

        // Fetch updated product with all relations
        const updatedProduct = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                brand: true,
                attributes: true,
            },
        })

        return NextResponse.json({
            success: true,
            data: updatedProduct,
            message: 'Product updated successfully',
        })
    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update product' },
            { status: 500 }
        )
    }
})

// DELETE /api/products/[id] - Soft delete product (Admin only)
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

        // Soft delete by setting isArchived to true
        await prisma.product.update({
            where: { id },
            data: {
                isArchived: true,
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete product' },
            { status: 500 }
        )
    }
})

