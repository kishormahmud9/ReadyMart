"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import ShippingStep from "@/components/checkout/ShippingStep"
import OrderSummary from "@/components/checkout/OrderSummary"
import PaymentStep from "@/components/checkout/PaymentStep"

export default function CheckoutPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [cart, setCart] = useState<any>(null)
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState("card")

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        try {
            const response = await fetch("/api/cart", {
                credentials: "include",
            })
            const data = await response.json()
            if (data.success) {
                if (data.data.items.length === 0) {
                    router.push("/cart")
                    return
                }
                setCart(data.data)
            } else {
                router.push("/cart")
            }
        } catch (error) {
            toast.error("Failed to load checkout")
        } finally {
            setLoading(false)
        }
    }

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a shipping address")
            return
        }

        setProcessing(true)
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    shippingAddressId: selectedAddressId,
                    paymentMethod,
                }),
            })

            const data = await response.json()

            if (data.success) {
                if (paymentMethod === "card") {
                    router.push(`/checkout/payment/${data.data.id}`)
                } else {
                    toast.success("Order placed successfully!")
                    router.push(`/order-confirmation?orderId=${data.data.id}`)
                }
            } else {
                toast.error(data.error || "Failed to place order")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-600" size={40} />
            </div>
        )
    }

    if (!cart) return null

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Steps */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1: Shipping */}
                        <div className={`bg-white rounded-xl shadow-sm border p-6 ${step === 1 ? 'border-orange-600 ring-1 ring-orange-600' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${step > 1 ? 'bg-green-500 text-white' : 'bg-orange-600 text-white'}`}>
                                        {step > 1 ? <CheckCircle size={16} /> : "1"}
                                    </span>
                                    Shipping Address
                                </h2>
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-sm text-orange-600 font-medium hover:underline"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {(step === 1 || selectedAddressId) && (
                                <div className={step !== 1 ? "opacity-50 pointer-events-none" : ""}>
                                    <ShippingStep
                                        selectedAddressId={selectedAddressId}
                                        onSelectAddress={setSelectedAddressId}
                                    />
                                    {step === 1 && (
                                        <button
                                            onClick={() => selectedAddressId ? setStep(2) : toast.error("Select an address")}
                                            className="mt-6 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Continue to Payment
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment */}
                        <div className={`bg-white rounded-xl shadow-sm border p-6 ${step === 2 ? 'border-orange-600 ring-1 ring-orange-600' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${step === 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    2
                                </span>
                                <h2 className={`text-xl font-bold ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>
                                    Payment Method
                                </h2>
                            </div>

                            {step === 2 && (
                                <div>
                                    <PaymentStep
                                        selectedMethod={paymentMethod}
                                        onSelectMethod={setPaymentMethod}
                                    />
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={processing}
                                        className="mt-6 w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="animate-spin" size={24} />
                                                Processing Order...
                                            </>
                                        ) : (
                                            <>
                                                Place Order
                                                <ChevronRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <OrderSummary
                                items={cart.items}
                                subtotal={cart.subtotal}
                                total={cart.subtotal} // Add shipping logic later if needed
                            />

                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                                <CheckCircle size={16} className="text-green-500" />
                                Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
