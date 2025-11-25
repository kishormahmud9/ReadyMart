import { prisma } from '../prisma'
import { VerificationType } from '@prisma/client'

/**
 * Generate 6-digit OTP
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Create verification token in database
 */
export async function createVerificationToken(
    email: string,
    type: VerificationType
): Promise<string> {
    // Delete any existing tokens for this email and type
    await prisma.verificationToken.deleteMany({
        where: { email, type },
    })

    // Generate new OTP
    const token = generateOTP()

    // Set expiration to 10 minutes from now
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Create token in database
    await prisma.verificationToken.create({
        data: {
            email,
            token,
            type,
            expiresAt,
        },
    })

    return token
}

/**
 * Verify OTP token
 */
export async function verifyOTP(
    email: string,
    token: string,
    type: VerificationType
): Promise<{ valid: boolean; message?: string }> {
    const verificationToken = await prisma.verificationToken.findFirst({
        where: {
            email,
            token,
            type,
        },
    })

    if (!verificationToken) {
        return { valid: false, message: 'Invalid OTP' }
    }

    if (new Date() > verificationToken.expiresAt) {
        // Delete expired token
        await prisma.verificationToken.delete({
            where: { id: verificationToken.id },
        })
        return { valid: false, message: 'OTP has expired' }
    }

    // Delete used token
    await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
    })

    return { valid: true }
}

/**
 * Delete all expired tokens (cleanup function)
 */
export async function cleanupExpiredTokens(): Promise<void> {
    await prisma.verificationToken.deleteMany({
        where: {
            expiresAt: {
                lt: new Date(),
            },
        },
    })
}
