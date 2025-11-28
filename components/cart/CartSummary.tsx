"use client"

import Link from "next/link"
import { ShoppingCart, ArrowRight } from "lucide-react"

interface CartSummaryProps {
    subtotal: number
    itemCount: number
    onCheckout?: () => void
}

export default function CartSummary({ subtotal, itemCount, onCheckout }: CartSummaryProps) {
    const shipping = 0 // Free shipping for now
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + shipping + tax

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            {/* Summary Items */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                </div>
                <div className="flex justify-between text-gray-700">
                    <span>Estimated Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <Link
                href="/checkout"
                className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
                Proceed to Checkout
                <ArrowRight size={20} />
            </Link>

            {/* Continue Shopping Link */}
            <Link
                href="/shop"
                className="block text-center text-orange-600 hover:text-orange-700 font-medium mt-4 transition-colors"
            >
                Continue Shopping
            </Link>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day return policy</span>
                </div>
            </div>
        </div>
    )
}
