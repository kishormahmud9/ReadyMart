"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, Calendar, Shield, ShoppingBag, MapPin, Loader2, Eye } from "lucide-react"
import { toast } from "react-hot-toast"

export default function AdminUserDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        if (params?.id) {
            fetchUser()
        }
    }, [params?.id])

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/admin/users/${params?.id}`)
            const data = await res.json()
            if (data.success) {
                setUser(data.data)
            } else {
                toast.error("User not found")
                router.push("/admin/users")
            }
        } catch (error) {
            toast.error("Failed to load user")
        } finally {
            setLoading(false)
        }
    }

    const handleRoleUpdate = async (newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return

        setUpdating(true)
        try {
            const res = await fetch(`/api/admin/users/${params?.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            })
            const data = await res.json()

            if (data.success) {
                toast.success(`User role updated to ${newRole}`)
                setUser({ ...user, role: newRole })
            } else {
                toast.error(data.error || "Failed to update role")
            }
        } catch (error) {
            toast.error("Failed to update role")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-orange-600" size={32} /></div>
    if (!user) return <div>User not found</div>

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/users" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                    <p className="text-gray-600">View and manage user information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{user.name || "No Name"}</h2>
                                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                                        <Mail size={16} />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                                        <Calendar size={16} />
                                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {user.role === 'ADMIN' && <Shield size={14} />}
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Role Management</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleRoleUpdate("USER")}
                                    disabled={user.role === "USER" || updating}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${user.role === "USER"
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Set as User
                                </button>
                                <button
                                    onClick={() => handleRoleUpdate("ADMIN")}
                                    disabled={user.role === "ADMIN" || updating}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${user.role === "ADMIN"
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-purple-600 text-white hover:bg-purple-700"
                                        }`}
                                >
                                    Set as Admin
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <ShoppingBag size={20} className="text-gray-500" />
                                Recent Orders
                            </h3>
                            <span className="text-sm text-gray-500">Total: {user._count.orders}</span>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {user.orders.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">No orders yet</div>
                            ) : (
                                user.orders.map((order: any) => (
                                    <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">${Number(order.totalAmount).toFixed(2)}</p>
                                            <span className="text-xs font-medium text-gray-500">{order.status}</span>
                                        </div>
                                        <Link href={`/admin/orders/${order.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Eye size={18} />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Addresses */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin size={20} className="text-gray-500" />
                                Addresses
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {user.addresses.length === 0 ? (
                                <p className="text-gray-500 italic">No addresses saved</p>
                            ) : (
                                user.addresses.map((addr: any) => (
                                    <div key={addr.id} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                                        <p className="font-medium text-gray-900 mb-1">{addr.type === 'BILLING' ? 'Billing' : 'Shipping'}</p>
                                        <p>{addr.street}</p>
                                        <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                                        <p>{addr.country}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
