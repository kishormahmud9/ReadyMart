"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CreditCard, MapPin, Calendar, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

export default function AdminOrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        if (params?.id) {
            fetchOrder()
        }
    }, [params?.id])

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${params?.id}`)
            const data = await res.json()
            if (data.success) {
                setOrder(data.data)
            } else {
                toast.error("Order not found")
                router.push("/admin/orders")
            }
        } catch (error) {
            toast.error("Failed to load order")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(true)
        try {
            const res = await fetch(`/api/orders/${params?.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })
            const data = await res.json()

            if (data.success) {
                toast.success(`Order status updated to ${newStatus}`)
                setOrder({ ...order, status: newStatus })
            } else {
                toast.error(data.error || "Failed to update status")
            }
        } catch (error) {
            toast.error("Failed to update status")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-orange-600" size={32} /></div>
    if (!order) return <div>Order not found</div>

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
                        <p className="text-gray-600 flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updating}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium"
                    >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Package size={20} className="text-gray-500" />
                                Order Items
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="p-6 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product.images[0] && (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                                    </div>
                                    <div className="text-right font-medium text-gray-900">
                                        ${(Number(item.price) * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <span className="font-medium text-gray-700">Total Amount</span>
                            <span className="text-xl font-bold text-gray-900">${Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Customer Details</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium text-gray-900">{order.user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium text-gray-900">{order.user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin size={20} className="text-gray-500" />
                                Shipping Address
                            </h3>
                        </div>
                        <div className="p-6">
                            {order.shippingAddress ? (
                                <div className="text-gray-700 space-y-1">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No shipping address</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <CreditCard size={20} className="text-gray-500" />
                                Payment Info
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Method</span>
                                <span className="font-medium text-gray-900">COD / Card</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
