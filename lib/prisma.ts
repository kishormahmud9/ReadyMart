import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Create Prisma Client instance with logging configuration
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
})

// In development, save the instance to global to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Graceful shutdown helper
export async function disconnectPrisma() {
    await prisma.$disconnect()
}
