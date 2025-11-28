"use client"

import { useState, useEffect } from "react"
import { Plus, MapPin } from "lucide-react"
import { toast } from "react-hot-toast"
import AddressForm from "@/components/user/AddressForm"
import AddressCard from "@/components/user/AddressCard"

interface Address {
    id: string
    type: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault: boolean
}

export default function ManageAddressPage() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)

    useEffect(() => {
        fetchAddresses()
    }, [])

    const fetchAddresses = async () => {
        try {
            const response = await fetch("/api/user/addresses", {
                credentials: "include",
            })
            const data = await response.json()

            if (data.success) {
                setAddresses(data.data)
            }
        } catch (error) {
            toast.error("Failed to load addresses")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (formData: any) => {
        try {
            const url = editingAddress
                ? `/api/user/addresses/${editingAddress.id}`
                : "/api/user/addresses"

            const response = await fetch(url, {
                method: editingAddress ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (data.success) {
                toast.success(data.message)
                await fetchAddresses()
                setShowForm(false)
                setEditingAddress(null)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const handleEdit = (address: Address) => {
        setEditingAddress(address)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return

        try {
            const response = await fetch(`/api/user/addresses/${id}`, {
                method: "DELETE",
                credentials: "include",
            })

            const data = await response.json()

            if (data.success) {
                toast.success(data.message)
                await fetchAddresses()
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Failed to delete address")
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingAddress(null)
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-gray-200 rounded w-1/4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Addresses</h1>
                <p className="text-gray-600">Add or update your delivery and billing addresses</p>
            </div>

            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="mb-6 inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                >
                    <Plus size={20} />
                    Add New Address
                </button>
            )}

            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {editingAddress ? "Edit Address" : "Add New Address"}
                    </h2>
                    <AddressForm
                        initialData={editingAddress || undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        submitLabel={editingAddress ? "Update Address" : "Add Address"}
                    />
                </div>
            )}

            {addresses.length === 0 && !showForm ? (
                <div className="text-center py-16">
                    <MapPin size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses yet</h3>
                    <p className="text-gray-600">Add your first address to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map(address => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
