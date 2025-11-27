import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/middleware'

// GET /api/admin/products - Get all products with pagination (Admin only)
export const GET = requireAdmin(async (request: NextRequest, user) => {
    try {
        const { searchParams } = new URL(request.url)

        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const search = searchParams.get('search') || ''
        const category = searchParams.get('category')
        const brand = searchParams.get('brand')
        const archived = searchParams.get('archived') === 'true'

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}

        if (archived !== null) {
            where.isArchived = archived
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (category) {
            where.categoryId = category
        }

        if (brand) {
            where.brandId = brand
        }

        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    brand: true,
                    _count: {
                        select: {
                            attributes: true,
                            reviews: true,
                            orderItems: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ])

        const totalPages = Math.ceil(totalCount / limit)

        return NextResponse.json({
            success: true,
            data: products,
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
        console.error('Error fetching admin products:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
})

// POST /api/admin/products - Create new product (Admin only)
export const POST = requireAdmin(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { attributes, ...productData } = body

        // Validate required fields
        if (!productData.name || !productData.slug || !productData.price || !productData.categoryId) {
            return NextResponse.json(
                { success: false, error: 'Name, slug, price, and category are required' },
                { status: 400 }
            )
        }

        // Check if slug already exists
        const existing = await prisma.product.findUnique({
            where: { slug: productData.slug },
        })

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 400 }
            )
        }

        // Create product with attributes
        const product = await prisma.product.create({
            data: {
                ...productData,
                attributes: attributes && attributes.length > 0 ? {
                    create: attributes.map((attr: { name: string; value: string }) => ({
                        name: attr.name,
                        value: attr.value,
                    })),
                } : undefined,
            },
            include: {
                category: true,
                brand: true,
                attributes: true,
            },
        })

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully',
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        )
    }
})
