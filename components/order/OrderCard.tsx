"use client"

import Link from "next/link"
import { Package, ChevronRight, Clock, CheckCircle, Truck } from "lucide-react"

interface OrderCardProps {
    order: {
        id: string
        orderNumber: string
        createdAt: string
        status: string
        totalAmount: number
        items: {
            id: string
            product: {
                name: string
                images: string[]
            }
        }[]
    }
}

export default function OrderCard({ order }: OrderCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-700'
            case 'SHIPPED': return 'bg-blue-100 text-blue-700'
            case 'PROCESSING': return 'bg-orange-100 text-orange-700'
            case 'CANCELLED': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle size={16} />
            case 'SHIPPED': return <Truck size={16} />
            default: return <Clock size={16} />
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-gray-900">
                            ${Number(order.totalAmount).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex -space-x-2 overflow-hidden">
                            {order.items.slice(0, 4).map((item) => (
                                <div key={item.id} className="relative w-10 h-10 rounded-full border-2 border-white bg-gray-100">
                                    {/* Use a placeholder if image is missing, but ideally use next/image */}
                                    <img
                                        src={item.product.images[0] || "/placeholder.png"}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                            ))}
                            {order.items.length > 4 && (
                                <div className="relative w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                    +{order.items.length - 4}
                                </div>
                            )}
                        </div>

                        <Link
                            href={`/order-confirmation?orderId=${order.id}`} // Reusing confirmation page as details for now, or create separate details page
                            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
                        >
                            View Details
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
