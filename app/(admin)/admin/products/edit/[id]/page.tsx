"use client"

import { use, useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`)
            const data = await res.json()

            if (data.success) {
                // Product loaded - for now just show placeholder
                setLoading(false)
            } else {
                toast.error("Product not found")
                router.push("/admin/products/manage")
            }
        } catch (error) {
            toast.error("Failed to load product")
            router.push("/admin/products/manage")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Link
                    href="/admin/products/manage"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
                        Edit Product
                    </h1>
                    <p className="text-gray-600 mt-2">Update product information</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-600 mb-4">
                    Edit product form (use same form structure as Add Product with pre-filled data)
                </p>
                <p className="text-sm text-gray-500">
                    This can be enhanced by copying the Add Product form and pre-filling it with existing product data from the API
                </p>
                <Link
                    href="/admin/products/manage"
                    className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold"
                >
                    Back to Products
                </Link>
            </div>
        </div>
    )
}
