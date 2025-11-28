"use client"

import { useState } from "react"
import Image from "next/image"

interface ImageGalleryProps {
    images: string[]
    productName: string
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)

    if (images.length === 0) {
        return (
            <div className="w-full aspect-square bg-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-gray-400 text-lg">No image available</span>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group">
                <Image
                    src={images[selectedImage]}
                    alt={`${productName} - Image ${selectedImage + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`
                                relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                                ${selectedImage === index
                                    ? "border-orange-600 ring-2 ring-orange-200"
                                    : "border-gray-200 hover:border-gray-300"
                                }
                            `}
                        >
                            <Image
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
