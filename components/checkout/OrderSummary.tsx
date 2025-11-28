"use client"

import Image from "next/image"

interface CartItem {
    id: string
    quantity: number
    product: {
        name: string
        price: string
        salePrice: string | null
        images: string[]
    }
}

interface OrderSummaryProps {
    items: CartItem[]
    subtotal: number
    shipping?: number
    total: number
    showItems?: boolean
}

export default function OrderSummary({
    items,
    subtotal,
    shipping = 0,
    total,
    showItems = true
}: OrderSummaryProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
            </div>

            <div className="p-6 space-y-6">
                {showItems && (
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                        src={item.product.images[0] || "/placeholder.png"}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-0 right-0 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded-tl-md font-medium">
                                        x{item.quantity}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {item.product.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        ${parseFloat(item.product.salePrice || item.product.price).toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-sm font-semibold text-gray-900">
                                    ${(parseFloat(item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showItems && <div className="border-t border-gray-200" />}

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax (Estimated)</span>
                        <span>$0.00</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-end">
                        <span className="text-base font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-orange-600">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
