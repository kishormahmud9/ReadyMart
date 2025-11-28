"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { toast } from "react-hot-toast"

interface CartItem {
    id: string
    quantity: number
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

interface CartItemCardProps {
    item: CartItem
    onUpdate: (itemId: string, quantity: number) => Promise<void>
    onRemove: (itemId: string) => Promise<void>
}

export default function CartItemCard({ item, onUpdate, onRemove }: CartItemCardProps) {
    const [updating, setUpdating] = useState(false)
    const [removing, setRemoving] = useState(false)

    const currentPrice = item.product.salePrice || item.product.price
    const itemTotal = parseFloat(currentPrice) * item.quantity

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > item.product.stock) return
        if (newQuantity === item.quantity) return

        setUpdating(true)
        try {
            await onUpdate(item.id, newQuantity)
        } catch (error) {
            toast.error("Failed to update quantity")
        } finally {
            setUpdating(false)
        }
    }

    const handleRemove = async () => {
        if (!confirm("Remove this item from your cart?")) return

        setRemoving(true)
        try {
            await onRemove(item.id)
            toast.success("Item removed from cart")
        } catch (error) {
            toast.error("Failed to remove item")
            setRemoving(false)
        }
    }

    return (
        <div className={`bg-white rounded-xl shadow-md p-6 transition-opacity ${removing ? 'opacity-50' : ''}`}>
            <div className="flex gap-6">
                {/* Product Image */}
                <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                        <Image
                            src={item.product.images[0] || "/placeholder.png"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/product/${item.product.slug}`}
                        className="font-semibold text-gray-900 hover:text-orange-600 transition-colors block mb-1 truncate"
                    >
                        {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                        {item.product.category.name}
                        {item.product.brand && ` • ${item.product.brand.name}`}
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

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                                disabled={updating || item.quantity <= 1}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:border-orange-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus size={16} />
                            </button>

                            <span className="w-12 text-center font-semibold">
                                {item.quantity}
                            </span>

                            <button
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                disabled={updating || item.quantity >= item.product.stock}
                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:border-orange-600 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {item.product.stock < 10 && (
                            <span className="text-sm text-orange-600">
                                Only {item.product.stock} left
                            </span>
                        )}
                    </div>
                </div>

                {/* Item Total & Remove */}
                <div className="flex flex-col items-end justify-between">
                    <button
                        onClick={handleRemove}
                        disabled={removing}
                        className="text-red-600 hover:text-red-700 p-2 transition-colors"
                        aria-label="Remove item"
                    >
                        <Trash2 size={20} />
                    </button>

                    <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                        <p className="text-xl font-bold text-gray-900">
                            ${itemTotal.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
