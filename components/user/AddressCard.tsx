"use client"

import { MapPin, Edit, Trash2, Check } from "lucide-react"

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

interface AddressCardProps {
    address: Address
    onEdit: (address: Address) => void
    onDelete: (id: string) => void
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
    return (
        <div className={`
            bg-white rounded-xl shadow-md p-6 border-2 transition-colors
            ${address.isDefault ? 'border-orange-600' : 'border-transparent'}
        `}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <MapPin className="text-orange-600" size={20} />
                    <span className="font-semibold text-gray-900">
                        {address.type === 'SHIPPING' ? 'Shipping Address' : 'Billing Address'}
                    </span>
                    {address.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">
                            <Check size={12} />
                            Default
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(address)}
                        className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                        aria-label="Edit address"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(address.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        aria-label="Delete address"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Address Details */}
            <div className="text-gray-700 space-y-1">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
            </div>
        </div>
    )
}
