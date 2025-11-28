import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// GET /api/user/addresses - List user addresses
export const GET = requireAuth(async (request: NextRequest, user) => {
    try {
        const addresses = await prisma.address.findMany({
            where: { userId: user.userId },
            orderBy: [
                { isDefault: 'desc' },
                { id: 'desc' },
            ],
        })

        return NextResponse.json({
            success: true,
            data: addresses,
        })
    } catch (error) {
        console.error('Error fetching addresses:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch addresses' },
            { status: 500 }
        )
    }
})

// POST /api/user/addresses - Create address
export const POST = requireAuth(async (request: NextRequest, user) => {
    try {
        const body = await request.json()
        const { type, street, city, state, zipCode, country, isDefault } = body

        // Validate required fields
        if (!type || !street || !city || !state || !zipCode || !country) {
            return NextResponse.json(
                { success: false, error: 'All address fields are required' },
                { status: 400 }
            )
        }

        // Validate type
        if (!['BILLING', 'SHIPPING'].includes(type)) {
            return NextResponse.json(
                { success: false, error: 'Type must be BILLING or SHIPPING' },
                { status: 400 }
            )
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: user.userId },
                data: { isDefault: false },
            })
        }

        // Create address
        const address = await prisma.address.create({
            data: {
                userId: user.userId,
                type,
                street: street.trim(),
                city: city.trim(),
                state: state.trim(),
                zipCode: zipCode.trim(),
                country: country.trim(),
                isDefault: isDefault || false,
            },
        })

        return NextResponse.json({
            success: true,
            data: address,
            message: 'Address added successfully',
        })
    } catch (error) {
        console.error('Error creating address:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create address' },
            { status: 500 }
        )
    }
})
