import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
const JWT_ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m'
const JWT_REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d'
const JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRES_IN || '30d'

export interface JWTPayload {
    userId: string
    email: string
    role: string
    type?: 'access' | 'refresh'
}

/**
 * Generate JWT access token (short-lived)
 */
export function generateAccessToken(userId: string, email: string, role: string): string {
    return jwt.sign(
        { userId, email, role, type: 'access' },
        JWT_SECRET,
        { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN }
    )
}

/**
 * Generate JWT refresh token (long-lived)
 */
export function generateRefreshToken(userId: string, email: string, role: string, rememberMe: boolean = false): string {
    const expiresIn = rememberMe ? JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRES_IN : JWT_REFRESH_TOKEN_EXPIRES_IN
    return jwt.sign(
        { userId, email, role, type: 'refresh' },
        JWT_SECRET,
        { expiresIn }
    )
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
        return decoded
    } catch (error) {
        console.error('JWT verification failed:', error)
        return null
    }
}

/**
 * Verify access token specifically
 */
export function verifyAccessToken(token: string): JWTPayload | null {
    const payload = verifyToken(token)
    if (payload && payload.type === 'access') {
        return payload
    }
    return null
}

/**
 * Verify refresh token specifically
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
    const payload = verifyToken(token)
    if (payload && payload.type === 'refresh') {
        return payload
    }
    return null
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(
    userId: string,
    email: string,
    role: string,
    rememberMe: boolean = false
): { accessToken: string; refreshToken: string } {
    return {
        accessToken: generateAccessToken(userId, email, role),
        refreshToken: generateRefreshToken(userId, email, role, rememberMe),
    }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    return authHeader.substring(7)
}
