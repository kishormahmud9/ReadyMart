import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/middleware'

// GET /api/categories - Get all categories (public)
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        return NextResponse.json({
            success: true,
            data: categories,
        })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}

// POST /api/categories - Create category (Admin only)
export const POST = requireAdmin(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { name, slug, description, image } = body

        if (!name || !slug) {
            return NextResponse.json(
                { success: false, error: 'Name and slug are required' },
                { status: 400 }
            )
        }

        // Check if slug already exists
        const existing = await prisma.category.findUnique({
            where: { slug },
        })

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 400 }
            )
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image,
            },
        })

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Category created successfully',
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create category' },
            { status: 500 }
        )
    }
})
