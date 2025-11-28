"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import BrandForm from "@/components/admin/BrandForm"

export default function EditBrandPage() {
    const params = useParams()
    const [brand, setBrand] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params?.id) {
            fetchBrand()
        }
    }, [params?.id])

    const fetchBrand = async () => {
        try {
            const response = await fetch(`/api/brands/${params?.id}`)
            const data = await response.json()
            if (data.success) {
                setBrand(data.data)
            }
        } catch (error) {
            console.error("Failed to load brand")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-orange-600" size={32} />
            </div>
        )
    }

    if (!brand) return <div>Brand not found</div>

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Brand</h1>
            <BrandForm initialData={brand} />
        </div>
    )
}
