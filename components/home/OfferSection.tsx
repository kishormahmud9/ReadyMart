"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer } from "lucide-react";

export default function OfferSection() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 10,
        minutes: 45,
        seconds: 30,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                    <Timer className="text-orange-400" size={20} />
                    <span className="text-orange-300 font-bold uppercase tracking-widest text-sm">Limited Time Offer</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                    Deal of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Day</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                    Get up to <span className="font-bold text-white">40% OFF</span> on our exclusive Winter Collection. Hurry up before the timer runs out!
                </p>

                {/* Countdown Timer */}
                <div className="flex justify-center space-x-4 md:space-x-8 mb-12">
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <div key={unit} className="flex flex-col items-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                                <span className="text-3xl md:text-5xl font-bold font-mono">{String(value).padStart(2, "0")}</span>
                            </div>
                            <span className="text-xs md:text-sm uppercase mt-3 text-gray-400 tracking-wider">{unit}</span>
                        </div>
                    ))}
                </div>

                <Link
                    href="/shop?offer=deal-of-day"
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
                >
                    Grab The Deal Now
                </Link>
            </div>
        </section>
    );
}
