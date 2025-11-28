"use client"

import { CreditCard, Wallet, Truck } from "lucide-react"

interface PaymentStepProps {
    selectedMethod: string
    onSelectMethod: (method: string) => void
}

export default function PaymentStep({ selectedMethod, onSelectMethod }: PaymentStepProps) {
    const methods = [
        {
            id: "card",
            name: "Credit / Debit Card",
            icon: CreditCard,
            description: "Pay securely with your bank card",
        },
        {
            id: "cod",
            name: "Cash on Delivery",
            icon: Truck,
            description: "Pay when you receive your order",
        },
        {
            id: "wallet",
            name: "Digital Wallet",
            icon: Wallet,
            description: "Pay with PayPal, Apple Pay, or Google Pay",
            disabled: true,
        },
    ]

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

            <div className="space-y-3">
                {methods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => !method.disabled && onSelectMethod(method.id)}
                        className={`
                            relative p-4 rounded-xl border-2 transition-all flex items-center gap-4
                            ${method.disabled
                                ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50"
                                : "cursor-pointer hover:border-orange-300"
                            }
                            ${selectedMethod === method.id
                                ? "border-orange-600 bg-orange-50"
                                : "border-gray-200 bg-white"
                            }
                        `}
                    >
                        <div className={`
                            p-3 rounded-full 
                            ${selectedMethod === method.id ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}
                        `}>
                            <method.icon size={24} />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                {method.name}
                                {method.disabled && (
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                        Coming Soon
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-gray-500">{method.description}</p>
                        </div>

                        <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${selectedMethod === method.id ? "border-orange-600" : "border-gray-300"}
                        `}>
                            {selectedMethod === method.id && (
                                <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
