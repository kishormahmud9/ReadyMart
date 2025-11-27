"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const validateForm = () => {
        const newErrors = {
            email: "",
            password: "",
        };

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({ email: "", password: "" });

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const user = await login(formData.email, formData.password, formData.rememberMe);

            toast.success("Welcome back!");

            // Redirect based on role
            if (user?.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/profile");
            }
        } catch (err: any) {
            // Check if backend sent field-specific error
            const errorMessage = err.message || "Login failed. Please try again.";
            const errorField = err.field;

            if (errorField === "email") {
                setErrors({ email: errorMessage, password: "" });
            } else if (errorField === "password") {
                setErrors({ email: "", password: errorMessage });
            } else {
                // General error - show toast
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        // Clear error for this field when user starts typing
        if (name === "email" || name === "password") {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative z-10">

                {/* Left Side - Welcome Section */}
                <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-orange-500 to-red-600 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <Link href="/" className="text-3xl font-extrabold tracking-tight mb-8 block">
                            Ready<span className="text-blue-900">Mart</span>
                        </Link>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome <br /> Back!</h2>
                        <p className="text-orange-100 text-lg mb-8">Sign in to continue your premium shopping experience.</p>
                    </div>
                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center mb-3">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Secure Shopping</p>
                                    <p className="text-sm text-orange-100">Your data is protected</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Fast Delivery</p>
                                    <p className="text-sm text-orange-100">Get your orders quickly</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Abstract Circles */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-900/20 rounded-full blur-2xl"></div>
                </div>

                {/* Right Side - Form Section */}
                <div className="md:w-1/2 p-8 md:p-12 bg-white">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
                    <p className="text-gray-500 mb-8">Enter your credentials to access your account.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            icon={Mail}
                            placeholder="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            error={errors.email}
                        />

                        <Input
                            icon={Lock}
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            error={errors.password}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            }
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            icon={loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" disabled={loading}>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" disabled={loading}>
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </Button>
                    </div>

                    <p className="text-center mt-8 text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-orange-600 font-bold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
