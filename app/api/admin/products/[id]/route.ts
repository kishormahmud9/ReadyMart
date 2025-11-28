import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/middleware'

// GET /api/admin/products/[id] - Get single product for editing (Admin only)
export const GET = requireAdmin(async (
    request: NextRequest,
    user,
    context?: { params: { id: string } }
) => {
    try {
        if (!context) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        const { id } = await context.params

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                brand: true,
            },
        })

        if (!product) {
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
})

// PATCH /api/admin/products/[id] - Update product (Admin only)
export const PATCH = requireAdmin(async (
    request: NextRequest,
    user,
    context?: { params: { id: string } }
) => {
    try {
        if (!context) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        const { id } = await context.params
        const body = await request.json()

        // Separate attributes if we want to handle them later, for now just update basic fields
        const { attributes, ...productData } = body

        // Check if slug exists (if changed)
        if (productData.slug) {
            const existing = await prisma.product.findUnique({
                where: { slug: productData.slug },
            })
            if (existing && existing.id !== id) {
                return NextResponse.json(
                    { success: false, error: 'Slug already exists' },
                    { status: 400 }
                )
            }
        }

        const product = await prisma.product.update({
            where: { id },
            data: productData,
        })

        return NextResponse.json({
            success: true,
            data: product,
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

// DELETE /api/admin/products/[id] - Delete product (Admin only)
export const DELETE = requireAdmin(async (
    request: NextRequest,
    user,
    context?: { params: { id: string } }
) => {
    try {
        if (!context) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        const { id } = await context.params

        await prisma.product.delete({
            where: { id },
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
