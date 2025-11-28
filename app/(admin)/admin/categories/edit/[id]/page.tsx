"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import CategoryForm from "@/components/admin/CategoryForm"

export default function EditCategoryPage() {
    const params = useParams()
    const [category, setCategory] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params?.id) {
            fetchCategory()
        }
    }, [params?.id])

    const fetchCategory = async () => {
        try {
            const response = await fetch(`/api/categories/${params?.id}`)
            const data = await response.json()
            if (data.success) {
                setCategory(data.data)
            }
        } catch (error) {
            console.error("Failed to load category")
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

    if (!category) return <div>Category not found</div>

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Category</h1>
            <CategoryForm initialData={category} />
        </div>
    )
}
