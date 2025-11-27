import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/middleware'

// GET /api/brands - Get all brands (public)
export async function GET() {
    try {
        const brands = await prisma.brand.findMany({
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
            data: brands,
        })
    } catch (error) {
        console.error('Error fetching brands:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch brands' },
            { status: 500 }
        )
    }
}

// POST /api/brands - Create brand (Admin only)
export const POST = requireAdmin(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { name, slug, logo } = body

        if (!name || !slug) {
            return NextResponse.json(
                { success: false, error: 'Name and slug are required' },
                { status: 400 }
            )
        }

        // Check if slug already exists
        const existing = await prisma.brand.findUnique({
            where: { slug },
        })

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 400 }
            )
        }

        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                logo,
            },
        })

        return NextResponse.json({
            success: true,
            data: brand,
            message: 'Brand created successfully',
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating brand:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create brand' },
            { status: 500 }
        )
    }
})
