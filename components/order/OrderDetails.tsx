"use client"

import Image from "next/image"
import { MapPin, Package, CreditCard } from "lucide-react"

interface OrderDetailsProps {
    order: {
        orderNumber: string
        createdAt: string
        status: string
        paymentStatus: string
        totalAmount: number
        shippingAddress: {
            street: string
            city: string
            state: string
            zipCode: string
            country: string
        }
        items: {
            id: string
            quantity: number
            price: number
            product: {
                name: string
                images: string[]
            }
        }[]
    }
}

export default function OrderDetails({ order }: OrderDetailsProps) {
    return (
        <div className="space-y-8">
            {/* Order Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Order Number</p>
                        <p className="font-bold text-gray-900">{order.orderNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Date Placed</p>
                        <p className="font-medium text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                        <p className="font-bold text-orange-600 text-lg">
                            ${Number(order.totalAmount).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Package size={20} className="text-orange-600" />
                                Order Items
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex gap-4">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={item.product.images[0] || "/placeholder.png"}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 mb-1">
                                            {item.product.name}
                                        </h4>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                ${Number(item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <MapPin size={20} className="text-orange-600" />
                            Shipping Address
                        </h3>
                        {order.shippingAddress ? (
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Address not available</p>
                        )}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <CreditCard size={20} className="text-orange-600" />
                            Payment Info
                        </h3>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Status</span>
                            <span className={`font-medium px-2 py-1 rounded-full text-xs ${order.paymentStatus === 'PAID'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
