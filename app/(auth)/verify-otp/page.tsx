"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { verifyOTP } from "@/lib/api/auth";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email") || "";
    const type = (searchParams.get("type") || "EMAIL_VERIFICATION") as "EMAIL_VERIFICATION" | "PASSWORD_RESET";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Auto-focus first input on mount
    useEffect(() => {
        const firstInput = document.getElementById("otp-0");
        if (firstInput) firstInput.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, 5);
        const lastInput = document.getElementById(`otp-${lastIndex}`);
        if (lastInput) lastInput.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const result = await verifyOTP(email, otpCode, type, false);

            if (!result.success) {
                setError(result.error || "Verification failed");
                setLoading(false);
                return;
            }

            setSuccess(true);

            // Redirect after success
            setTimeout(() => {
                router.push("/profile");
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Verification failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12 relative z-10">
                {success ? (
                    // Success State
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Verified!</h2>
                        <p className="text-gray-200 mb-6">Your email has been successfully verified.</p>
                        <p className="text-gray-300 text-sm">Redirecting to dashboard...</p>
                    </div>
                ) : (
                    // OTP Input State
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
                            <p className="text-gray-200 mb-2">We've sent a 6-digit code to</p>
                            <p className="text-orange-400 font-semibold">{email}</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-center gap-2 mb-8">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        disabled={loading}
                                        className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border-2 border-white/20 rounded-lg text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition disabled:opacity-50"
                                    />
                                ))}
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                icon={loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                                disabled={loading || otp.some(d => !d)}
                            >
                                {loading ? "Verifying..." : "Verify Email"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-300 text-sm mb-2">Didn't receive the code?</p>
                            <button
                                type="button"
                                className="text-orange-400 hover:text-orange-300 font-semibold text-sm transition disabled:opacity-50"
                                disabled={loading}
                            >
                                Resend Code
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="text-gray-300 hover:text-white text-sm transition"
                                disabled={loading}
                            >
                                ← Back to registration
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

