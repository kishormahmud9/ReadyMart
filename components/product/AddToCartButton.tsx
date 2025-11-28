"use client"

import { useState } from "react"
import { ShoppingCart, Loader2, Check } from "lucide-react"
import { toast } from "react-hot-toast"

interface AddToCartButtonProps {
    productId: string
    productName: string
    quantity: number
    stock: number
    disabled?: boolean
}

export default function AddToCartButton({
    productId,
    productName,
    quantity,
    stock,
    disabled = false,
}: AddToCartButtonProps) {
    const [loading, setLoading] = useState(false)
    const [added, setAdded] = useState(false)

    const handleAddToCart = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId, quantity }),
            })

            const data = await response.json()

            if (data.success) {
                setAdded(true)
                toast.success(`${productName} added to cart!`)
                setTimeout(() => setAdded(false), 2000)
            } else {
                toast.error(data.error || "Failed to add to cart")
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const isDisabled = disabled || stock === 0 || loading

    return (
        <button
            onClick={handleAddToCart}
            disabled={isDisabled}
            className={`
                w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3
                ${added
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl
            `}
        >
            {loading ? (
                <>
                    <Loader2 size={24} className="animate-spin" />
                    Adding to Cart...
                </>
            ) : added ? (
                <>
                    <Check size={24} />
                    Added to Cart
                </>
            ) : (
                <>
                    <ShoppingCart size={24} />
                    Add to Cart
                </>
            )}
        </button>
    )
}
