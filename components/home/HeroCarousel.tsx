"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const slides = [
    {
        id: 1,
        title: "Summer Collection 2024",
        subtitle: "Experience the warmth with our vibrant new arrivals.",
        cta: "Shop The Collection",
        link: "/shop?category=summer",
        gradient: "bg-gradient-to-r from-orange-400 to-red-500",
        textColor: "text-white",
    },
    {
        id: 2,
        title: "Premium Men's Wear",
        subtitle: "Sophistication meets comfort. Elevate your wardrobe.",
        cta: "Explore Men",
        link: "/shop?category=men",
        gradient: "bg-gradient-to-r from-blue-900 to-blue-600",
        textColor: "text-white",
    },
    {
        id: 3,
        title: "Exclusive Women's Fashion",
        subtitle: "Unleash your inner elegance with our latest trends.",
        cta: "Explore Women",
        link: "/shop?category=women",
        gradient: "bg-gradient-to-r from-pink-500 to-purple-600",
        textColor: "text-white",
    },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden shadow-2xl">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out transform ${index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
                        } ${slide.gradient}`}
                >
                    {/* Overlay Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <h2 className={`text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg ${slide.textColor} animate-fade-in-up`}>
                            {slide.title}
                        </h2>
                        <p className={`text-xl md:text-3xl mb-10 font-light tracking-wide drop-shadow-md ${slide.textColor} animate-fade-in-up delay-100`}>
                            {slide.subtitle}
                        </p>
                        <Link
                            href={slide.link}
                            className="group bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transition duration-300 inline-flex items-center space-x-2 animate-bounce-subtle"
                        >
                            <span>{slide.cta}</span>
                            <ArrowRight className="group-hover:translate-x-1 transition duration-300" size={20} />
                        </Link>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/40 text-white transition duration-300 border border-white/30"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/40 text-white transition duration-300 border border-white/30"
            >
                <ChevronRight size={32} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 shadow-lg ${index === current ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
