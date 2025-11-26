"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authAPI from '@/lib/api/auth';

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    emailVerified: Date | null;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<{ userId: string; email: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const result = await authAPI.getCurrentUser();
            if (result.success && result.user) {
                setUser(result.user);
            } else {
                // Try to refresh token
                const refreshResult = await authAPI.refreshToken();
                if (refreshResult.success && refreshResult.user) {
                    setUser(refreshResult.user);
                } else {
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string, rememberMe: boolean) => {
        const result = await authAPI.login(email, password, rememberMe);

        if (!result.success) {
            const error: any = new Error(result.error || 'Login failed');
            error.field = result.field;
            throw error;
        }

        if (result.user) {
            setUser(result.user);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const result = await authAPI.register(name, email, password);

        if (!result.success) {
            throw new Error(result.error || 'Registration failed');
        }

        if (!result.data) {
            throw new Error('Registration failed - no data returned');
        }

        return result.data;
    };

    const logout = async () => {
        await authAPI.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        const result = await authAPI.getCurrentUser();
        if (result.success && result.user) {
            setUser(result.user);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
