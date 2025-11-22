"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);

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
                        <h2 className="text-4xl font-bold mb-4 leading-tight">Join the <br /> Revolution</h2>
                        <p className="text-orange-100 text-lg mb-8">Experience premium fashion like never before. Create your account today.</p>
                    </div>
                    <div className="relative z-10">
                        <div className="flex -space-x-4 mb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center text-xs font-bold text-orange-600">
                                +2k
                            </div>
                        </div>
                        <p className="text-sm text-orange-100 font-medium">Join 2,000+ happy shoppers</p>
                    </div>

                    {/* Abstract Circles */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-900/20 rounded-full blur-2xl"></div>
                </div>

                {/* Right Side - Form Section */}
                <div className="md:w-1/2 p-8 md:p-12 bg-white">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h3>
                    <p className="text-gray-500 mb-8">Enter your details to get started.</p>

                    <form className="space-y-5">
                        <Input
                            icon={User}
                            placeholder="Full Name"
                            type="text"
                        />

                        <Input
                            icon={Mail}
                            placeholder="Email Address"
                            type="email"
                        />

                        <Input
                            icon={Lock}
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            }
                        />

                        <Button type="submit" fullWidth icon={<ArrowRight size={20} />}>
                            Sign Up
                        </Button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline">
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
                        <Button variant="outline">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </Button>
                    </div>

                    <p className="text-center mt-8 text-gray-500 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-orange-600 font-bold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
