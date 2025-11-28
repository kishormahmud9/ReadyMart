"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ orderId, amount }: { orderId: string, amount: number }) {
    const stripe = useStripe()
    const elements = useElements()
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!stripe) {
            return
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        )

        if (!clientSecret) {
            return
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!")
                    break
                case "processing":
                    setMessage("Your payment is processing.")
                    break
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.")
                    break
                default:
                    setMessage("Something went wrong.")
                    break
            }
        })
    }, [stripe])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/order-confirmation?orderId=${orderId}`,
            },
        })

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.")
        } else {
            setMessage("An unexpected error occurred.")
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

            {message && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                    {message}
                </div>
            )}

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full py-3 px-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                    </>
                ) : (
                    `Pay $${amount.toFixed(2)}`
                )}
            </button>
        </form>
    )
}

export default function PaymentPage() {
    const params = useParams()
    const [clientSecret, setClientSecret] = useState("")
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params?.id) {
            // Fetch order details first to get amount
            fetch(`/api/orders/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setOrder(data.data)
                        // Create PaymentIntent
                        return fetch("/api/payment/create-intent", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderId: params.id }),
                        })
                    }
                    throw new Error("Order not found")
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setClientSecret(data.clientSecret)
                    } else {
                        toast.error(data.error || "Failed to initialize payment")
                    }
                })
                .catch(err => {
                    console.error(err)
                    toast.error("Failed to load payment")
                })
                .finally(() => setLoading(false))
        }
    }, [params?.id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-600" size={48} />
            </div>
        )
    }

    if (!clientSecret || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Failed to load payment details
            </div>
        )
    }

    const appearance = {
        theme: 'stripe' as const,
    }
    const options = {
        clientSecret,
        appearance,
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-8 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-900 text-center">Complete Payment</h2>
                    <p className="mt-2 text-center text-gray-600">Order #{order.orderNumber}</p>
                    <p className="mt-1 text-center text-3xl font-extrabold text-orange-600">
                        ${Number(order.totalAmount).toFixed(2)}
                    </p>
                </div>

                <div className="p-6">
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm orderId={order.id} amount={Number(order.totalAmount)} />
                    </Elements>
                </div>
            </div>
        </div>
    )
}
