"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface Category {
    id: string
    name: string
}

interface Brand {
    id: string
    name: string
}

export default function AddProductPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        salePrice: "",
        stock: "",
        categoryId: "",
        brandId: "",
        images: [""],
        isFeatured: false,
    })

    useEffect(() => {
        fetchFilters()
    }, [])

    const fetchFilters = async () => {
        try {
            const [catRes, brandRes] = await Promise.all([
                fetch("/api/categories"),
                fetch("/api/brands"),
            ])

            const catData = await catRes.json()
            const brandData = await brandRes.json()

            if (catData.success) setCategories(catData.data)
            if (brandData.success) setBrands(brandData.data)
        } catch (error) {
            toast.error("Failed to load filters")
        }
    }

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        })
    }

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images]
        newImages[index] = value
        setFormData({ ...formData, images: newImages })
    }

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ""] })
    }

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index)
        setFormData({ ...formData, images: newImages.length ? newImages : [""] })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const productData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                price: parseFloat(formData.price),
                salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
                stock: parseInt(formData.stock),
                categoryId: formData.categoryId,
                brandId: formData.brandId || null,
                images: formData.images.filter((img) => img.trim() !== ""),
                isFeatured: formData.isFeatured,
            }

            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            })

            const data = await res.json()

            if (data.success) {
                toast.success("Product created successfully!")
                router.push("/admin/products/manage")
            } else {
                toast.error(data.error || "Failed to create product")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setSubmitting(false)
        }
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
                        Add Product
                    </h1>
                    <p className="text-gray-600 mt-2">Create a new product for your store</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="e.g., Nike Air Max 270"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="nike-air-max-270"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Detailed product description..."
                        />
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Pricing & Inventory</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Regular Price *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sale Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.salePrice}
                                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                            <input
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Organization */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Organization</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                            <select
                                value={formData.brandId}
                                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">No brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-lg font-bold text-gray-900">Product Images</h3>
                        <button
                            type="button"
                            onClick={addImageField}
                            className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700 font-semibold"
                        >
                            <Plus size={16} />
                            <span>Add Image</span>
                        </button>
                    </div>

                    {formData.images.map((img, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="url"
                                value={img}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="https://..."
                            />
                            {formData.images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Features</h3>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-700 font-medium">Mark as Featured Product</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-6 border-t">
                    <Link
                        href="/admin/products/manage"
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 text-center transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 shadow-lg"
                    >
                        {submitting ? "Creating..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    )
}
