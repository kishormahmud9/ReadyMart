"use client"

import { useState, useEffect } from "react"
import { Plus, CheckCircle, MapPin } from "lucide-react"
import AddressForm from "@/components/user/AddressForm"

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

interface ShippingStepProps {
    selectedAddressId: string | null
    onSelectAddress: (id: string) => void
}

export default function ShippingStep({ selectedAddressId, onSelectAddress }: ShippingStepProps) {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

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
                // Auto-select default address if none selected
                if (!selectedAddressId) {
                    const defaultAddr = data.data.find((a: Address) => a.isDefault)
                    if (defaultAddr) {
                        onSelectAddress(defaultAddr.id)
                    } else if (data.data.length > 0) {
                        onSelectAddress(data.data[0].id)
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load addresses")
        } finally {
            setLoading(false)
        }
    }

    const handleAddressAdded = async (newAddress: any) => {
        try {
            const response = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newAddress),
            })
            const data = await response.json()
            if (data.success) {
                await fetchAddresses()
                setShowForm(false)
                onSelectAddress(data.data.id)
            }
        } catch (error) {
            console.error("Failed to add address")
        }
    }

    if (loading) {
        return <div className="animate-pulse h-48 bg-gray-100 rounded-xl" />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                        <Plus size={16} />
                        Add New
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
                    <AddressForm
                        onSubmit={handleAddressAdded}
                        onCancel={() => setShowForm(false)}
                        submitLabel="Use This Address"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            onClick={() => onSelectAddress(address.id)}
                            className={`
                                relative p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${selectedAddressId === address.id
                                    ? "border-orange-600 bg-orange-50"
                                    : "border-gray-200 hover:border-orange-300 bg-white"
                                }
                            `}
                        >
                            {selectedAddressId === address.id && (
                                <div className="absolute top-4 right-4 text-orange-600">
                                    <CheckCircle size={20} className="fill-current" />
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <MapPin className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <p className="font-medium text-gray-900">{address.street}</p>
                                    <p className="text-sm text-gray-600">
                                        {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-sm text-gray-500">{address.country}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {addresses.length === 0 && (
                        <div className="col-span-full text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">No addresses saved yet</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
                            >
                                Add Shipping Address
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
