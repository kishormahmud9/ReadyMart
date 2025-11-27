import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Get query parameters
        const q = searchParams.get('q') || ''
        const category = searchParams.get('category')
        const brand = searchParams.get('brand')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const sort = searchParams.get('sort') || 'newest'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        // Build where clause
        const where: any = {
            isArchived: false,
        }

        // Text search
        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ]
        }

        // Category filter
        if (category) {
            where.category = {
                slug: category,
            }
        }

        // Brand filter
        if (brand) {
            where.brand = {
                slug: brand,
            }
        }

        // Price range filter
        if (minPrice || maxPrice) {
            where.price = {}
            if (minPrice) {
                where.price.gte = parseFloat(minPrice)
            }
            if (maxPrice) {
                where.price.lte = parseFloat(maxPrice)
            }
        }

        // Build orderBy clause
        let orderBy: any = {}
        switch (sort) {
            case 'price-asc':
                orderBy = { price: 'asc' }
                break
            case 'price-desc':
                orderBy = { price: 'desc' }
                break
            case 'name':
                orderBy = { name: 'asc' }
                break
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' }
                break
        }

        // Calculate pagination
        const skip = (page - 1) * limit

        // Fetch products with pagination
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    brand: true,
                    attributes: true,
                },
                orderBy,
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
        console.error('Error searching products:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to search products' },
            { status: 500 }
        )
    }
}
