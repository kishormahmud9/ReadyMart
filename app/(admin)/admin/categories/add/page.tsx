"use client"

import CategoryForm from "@/components/admin/CategoryForm"

export default function AddCategoryPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h1>
            <CategoryForm />
        </div>
    )
}
