"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "react-hot-toast"

interface WishlistItem {
    id: string
    productId: string
    product: {
        id: string
        name: string
        slug: string
        price: string
        salePrice: string | null
        images: string[]
        stock: number
        category: { name: string }
        brand: { name: string } | null
    }
}

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchWishlist()
    }, [])

    const fetchWishlist = async () => {
        try {
            const response = await fetch("/api/wishlist", {
                credentials: "include",
            })
            const data = await response.json()

            if (data.success) {
                setWishlist(data.data)
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error)
            toast.error("Failed to load wishlist")
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (id: string) => {
        try {
            const response = await fetch(`/api/wishlist/${id}`, {
                method: "DELETE",
                credentials: "include",
            })
            const data = await response.json()

            if (data.success) {
                setWishlist(wishlist.filter(item => item.id !== id))
                toast.success("Removed from wishlist")
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Failed to remove item")
        }
    }

    const handleMoveToCart = async (productId: string, productName: string) => {
        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId, quantity: 1 }),
            })
            const data = await response.json()

            if (data.success) {
                toast.success(`${productName} added to cart!`)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Failed to add to cart")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-gray-200 rounded w-1/4" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-80 bg-gray-200 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const isEmpty = wishlist.length === 0

    if (isEmpty) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-32 h-32 mx-auto mb-6 text-gray-300">
                            <Heart size={128} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
                        <p className="text-gray-600 mb-8">
                            Save your favorite items for later!
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-colors"
                        >
                            Explore Products
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 mb-2">
                        My Wishlist
                    </h1>
                    <p className="text-gray-600">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlist.map(item => {
                        const currentPrice = item.product.salePrice || item.product.price
                        const inStock = item.product.stock > 0

                        return (
                            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden group">
                                {/* Product Image */}
                                <Link href={`/product/${item.product.slug}`} className="block relative aspect-square">
                                    <Image
                                        src={item.product.images[0] || "/placeholder.png"}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {!inStock && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                </Link>

                                {/* Product Info */}
                                <div className="p-4">
                                    <Link
                                        href={`/product/${item.product.slug}`}
                                        className="font-semibold text-gray-900 hover:text-orange-600 transition-colors block mb-1 truncate"
                                    >
                                        {item.product.name}
                                    </Link>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {item.product.category.name}
                                    </p>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-lg font-bold text-orange-600">
                                            ${parseFloat(currentPrice).toFixed(2)}
                                        </span>
                                        {item.product.salePrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                ${parseFloat(item.product.price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {inStock && (
                                            <button
                                                onClick={() => handleMoveToCart(item.productId, item.product.name)}
                                                className="flex-1 py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart size={16} />
                                                Add to Cart
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="p-2 border border-gray-300 hover:border-red-600 hover:text-red-600 rounded-lg transition-colors"
                                            aria-label="Remove from wishlist"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
