"use client"

import BrandForm from "@/components/admin/BrandForm"

export default function AddBrandPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Brand</h1>
            <BrandForm />
        </div>
    )
}
