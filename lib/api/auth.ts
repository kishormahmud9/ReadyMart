// Authentication API Service Layer
// Handles all authentication-related API calls

interface User {
    id: string
    name: string | null
    email: string
    role: string
    emailVerified: Date | null
}

interface LoginResponse {
    success: boolean
    message?: string
    user?: User
    error?: string
    field?: string
    requiresVerification?: boolean
}

interface RegisterResponse {
    success: boolean
    message?: string
    data?: {
        userId: string
        email: string
    }
    error?: string
}

interface VerifyOTPResponse {
    success: boolean
    message?: string
    user?: User
    error?: string
}

interface RefreshTokenResponse {
    success: boolean
    message?: string
    user?: User
    error?: string
}

const API_BASE = '/api/auth'

/**
 * Login user with email and password
 */
export async function login(
    email: string,
    password: string,
    rememberMe: boolean = false
): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Include cookies
        body: JSON.stringify({ email, password, rememberMe }),
    })

    return response.json()
}

/**
 * Register new user
 */
export async function register(
    name: string,
    email: string,
    password: string
): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
    })

    return response.json()
}

/**
 * Verify OTP (email verification or password reset)
 */
export async function verifyOTP(
    email: string,
    otp: string,
    type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET',
    rememberMe: boolean = false
): Promise<VerifyOTPResponse> {
    const response = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp, type, rememberMe }),
    })

    return response.json()
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(): Promise<RefreshTokenResponse> {
    const response = await fetch(`${API_BASE}/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    return response.json()
}

/**
 * Logout user (clear cookies)
 */
export async function logout(): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    return response.json()
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string }> {
    const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })

    return response.json()
}

/**
 * Request password reset OTP
 */
export async function forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
    })

    return response.json()
}

/**
 * Reset password with OTP
 */
export async function resetPassword(
    email: string,
    otp: string,
    newPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
    const response = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp, newPassword }),
    })

    return response.json()
}
