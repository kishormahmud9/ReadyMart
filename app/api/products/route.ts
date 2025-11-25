import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET: Fetch all products
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                brand: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20 // Limit to 20 products
        })

        return NextResponse.json({
            success: true,
            data: products,
            count: products.length
        })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch products'
            },
            { status: 500 }
        )
    }
}

// POST: Create a new product
export async function POST(request: Request) {
    try {
        const body = await request.json()

        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                salePrice: body.salePrice,
                stock: body.stock,
                images: body.images || [],
                categoryId: body.categoryId,
                brandId: body.brandId,
                isFeatured: body.isFeatured || false,
            },
            include: {
                category: true,
                brand: true,
            }
        })

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully'
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create product'
            },
            { status: 500 }
        )
    }
}
