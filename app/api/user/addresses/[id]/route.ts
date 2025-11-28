import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/middleware'

// PATCH /api/user/addresses/[id] - Update address
export const PATCH = requireAuth(async (request: NextRequest, user, context) => {
    try {
        const { id } = context.params as { id: string }
        const body = await request.json()
        const { type, street, city, state, zipCode, country, isDefault } = body

        // Find address and verify ownership
        const address = await prisma.address.findUnique({
            where: { id },
        })

        if (!address) {
            return NextResponse.json(
                { success: false, error: 'Address not found' },
                { status: 404 }
            )
        }

        if (address.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: user.userId,
                    id: { not: id },
                },
                data: { isDefault: false },
            })
        }

        // Update address
        const updatedAddress = await prisma.address.update({
            where: { id },
            data: {
                ...(type && { type }),
                ...(street && { street: street.trim() }),
                ...(city && { city: city.trim() }),
                ...(state && { state: state.trim() }),
                ...(zipCode && { zipCode: zipCode.trim() }),
                ...(country && { country: country.trim() }),
                ...(isDefault !== undefined && { isDefault }),
            },
        })

        return NextResponse.json({
            success: true,
            data: updatedAddress,
            message: 'Address updated successfully',
        })
    } catch (error) {
        console.error('Error updating address:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update address' },
            { status: 500 }
        )
    }
})

// DELETE /api/user/addresses/[id] - Delete address
export const DELETE = requireAuth(async (request: NextRequest, user, context) => {
    try {
        const { id } = context.params as { id: string }

        // Find address and verify ownership
        const address = await prisma.address.findUnique({
            where: { id },
        })

        if (!address) {
            return NextResponse.json(
                { success: false, error: 'Address not found' },
                { status: 404 }
            )
        }

        if (address.userId !== user.userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            )
        }

        // Delete address
        await prisma.address.delete({
            where: { id },
        })

        // If it was default, set another as default
        if (address.isDefault) {
            const firstAddress = await prisma.address.findFirst({
                where: { userId: user.userId },
            })

            if (firstAddress) {
                await prisma.address.update({
                    where: { id: firstAddress.id },
                    data: { isDefault: true },
                })
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Address deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting address:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete address' },
            { status: 500 }
        )
    }
})
