"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import OrderDetails from "@/components/order/OrderDetails"

function OrderConfirmationContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (orderId) {
            fetchOrder()
        }
    }, [orderId])

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                credentials: "include",
            })
            const data = await response.json()
            if (data.success) {
                setOrder(data.data)
            }
        } catch (error) {
            console.error("Failed to load order")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-orange-600" size={40} />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
                <Link href="/shop" className="text-orange-600 hover:underline mt-4 inline-block">
                    Return to Shop
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
                <p className="text-xl text-gray-600">
                    Your order <span className="font-bold text-gray-900">{order.orderNumber}</span> has been placed.
                </p>
                <p className="text-gray-500 mt-2">
                    We'll send you an email confirmation shortly.
                </p>
            </div>

            <OrderDetails order={order} />

            <div className="mt-12 text-center">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors"
                >
                    Continue Shopping
                    <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    )
}

export default function OrderConfirmationPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin" /></div>}>
                <OrderConfirmationContent />
            </Suspense>
        </div>
    )
}
